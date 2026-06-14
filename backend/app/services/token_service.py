import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.db.models import EmailVerificationToken, PasswordResetToken


def generate_secure_token() -> str:
    return secrets.token_urlsafe(32)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def get_token_expiry(minutes: int) -> datetime:
    return datetime.now(timezone.utc) + timedelta(minutes=minutes)


def find_valid_password_reset_token(
    db: Session,
    raw_token: str,
) -> PasswordResetToken | None:
    token_hash = hash_token(raw_token)
    now = datetime.now(timezone.utc)

    token_record = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.token_hash == token_hash,
            PasswordResetToken.used_at.is_(None),
            PasswordResetToken.expires_at > now,
        )
        .first()
    )
    return token_record


def find_valid_email_verification_token(
    db: Session,
    raw_token: str,
) -> EmailVerificationToken | None:
    token_hash = hash_token(raw_token)
    now = datetime.now(timezone.utc)

    token_record = (
        db.query(EmailVerificationToken)
        .filter(
            EmailVerificationToken.token_hash == token_hash,
            EmailVerificationToken.used_at.is_(None),
            EmailVerificationToken.expires_at > now,
        )
        .first()
    )
    return token_record


def mark_token_used(token_record: PasswordResetToken | EmailVerificationToken) -> None:
    token_record.used_at = datetime.now(timezone.utc)
