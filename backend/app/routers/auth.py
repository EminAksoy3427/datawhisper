from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from app.db.database import get_db
from app.db.models import EmailVerificationToken, PasswordResetToken, User
from app.schemas.auth import (
    AuthResponse,
    ForgotPasswordRequest,
    MessageResponse,
    ResetPasswordRequest,
    UserLogin,
    UserRegister,
    UserResponse,
)
from app.services.email_service import send_password_reset_email, send_verification_email
from app.services.token_service import (
    find_valid_email_verification_token,
    find_valid_password_reset_token,
    generate_secure_token,
    get_token_expiry,
    hash_token,
    mark_token_used,
)

router = APIRouter(prefix="/auth", tags=["auth"])

FORGOT_PASSWORD_MESSAGE = (
    "Eğer bu e-posta ile kayıtlı bir hesap varsa, şifre sıfırlama bağlantısı gönderildi."
)
RESEND_VERIFICATION_MESSAGE = (
    "Eğer e-posta adresiniz henüz doğrulanmadıysa, doğrulama bağlantısı gönderildi."
)
VERIFY_EMAIL_SUCCESS_MESSAGE = "E-posta adresiniz başarıyla doğrulandı."
RESET_PASSWORD_SUCCESS_MESSAGE = "Şifreniz başarıyla güncellendi."


def _build_auth_response(user: User) -> AuthResponse:
    return AuthResponse(
        user=UserResponse.model_validate(user),
        access_token=create_access_token(user.id),
        token_type="bearer",
    )


def _create_verification_token(db: Session, user: User) -> str:
    raw_token = generate_secure_token()
    settings = get_settings()

    token_record = EmailVerificationToken(
        user_id=user.id,
        token_hash=hash_token(raw_token),
        expires_at=get_token_expiry(settings.email_verification_token_expire_minutes),
    )
    db.add(token_record)
    db.commit()
    return raw_token


def _send_verification_email_task(user_email: str, raw_token: str) -> None:
    send_verification_email(user_email, raw_token)


def _send_password_reset_email_task(user_email: str, raw_token: str) -> None:
    send_password_reset_email(user_email, raw_token)


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(
    payload: UserRegister,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
) -> AuthResponse:
    existing_user = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    user = User(
        name=payload.name.strip(),
        email=payload.email.lower(),
        hashed_password=hash_password(payload.password),
        email_verified=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    try:
        raw_token = generate_secure_token()
        settings = get_settings()
        token_record = EmailVerificationToken(
            user_id=user.id,
            token_hash=hash_token(raw_token),
            expires_at=get_token_expiry(settings.email_verification_token_expire_minutes),
        )
        db.add(token_record)
        db.commit()
        background_tasks.add_task(_send_verification_email_task, user.email, raw_token)
    except Exception:
        db.rollback()

    return _build_auth_response(user)


@router.post("/login", response_model=AuthResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)) -> AuthResponse:
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return _build_auth_response(user)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)) -> UserResponse:
    return UserResponse.model_validate(current_user)


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(
    payload: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
) -> MessageResponse:
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if user is not None:
        raw_token = generate_secure_token()
        settings = get_settings()
        token_record = PasswordResetToken(
            user_id=user.id,
            token_hash=hash_token(raw_token),
            expires_at=get_token_expiry(settings.password_reset_token_expire_minutes),
        )
        db.add(token_record)
        db.commit()
        background_tasks.add_task(_send_password_reset_email_task, user.email, raw_token)

    return MessageResponse(message=FORGOT_PASSWORD_MESSAGE)


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db),
) -> MessageResponse:
    token_record = find_valid_password_reset_token(db, payload.token)
    if token_record is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token.",
        )

    user = db.query(User).filter(User.id == token_record.user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token.",
        )

    user.hashed_password = hash_password(payload.password)
    mark_token_used(token_record)
    db.commit()

    return MessageResponse(message=RESET_PASSWORD_SUCCESS_MESSAGE)


@router.post("/resend-verification", response_model=MessageResponse)
def resend_verification(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MessageResponse:
    if not current_user.email_verified:
        raw_token = _create_verification_token(db, current_user)
        background_tasks.add_task(
            _send_verification_email_task,
            current_user.email,
            raw_token,
        )

    return MessageResponse(message=RESEND_VERIFICATION_MESSAGE)


@router.get("/verify-email", response_model=MessageResponse)
def verify_email(
    token: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
) -> MessageResponse:
    token_record = find_valid_email_verification_token(db, token)
    if token_record is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token.",
        )

    user = db.query(User).filter(User.id == token_record.user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token.",
        )

    user.email_verified = True
    mark_token_used(token_record)
    db.commit()

    return MessageResponse(message=VERIFY_EMAIL_SUCCESS_MESSAGE)
