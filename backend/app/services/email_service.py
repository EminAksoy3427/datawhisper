import logging

import resend

from app.core.config import get_settings

logger = logging.getLogger(__name__)


def _email_is_configured() -> bool:
    settings = get_settings()
    return bool(settings.resend_api_key and settings.email_from)


def send_password_reset_email(to_email: str, token: str) -> None:
    if not _email_is_configured():
        logger.warning(
            "Password reset email skipped: RESEND_API_KEY or EMAIL_FROM is not configured."
        )
        return

    settings = get_settings()
    reset_url = f"{settings.frontend_url.rstrip('/')}/reset-password?token={token}"

    resend.api_key = settings.resend_api_key
    try:
        resend.Emails.send(
            {
                "from": settings.email_from,
                "to": [to_email],
                "subject": "DataWhisper şifre sıfırlama",
                "html": (
                    "<p>Merhaba,</p>"
                    "<p>DataWhisper hesabınız için şifre sıfırlama talebi aldık.</p>"
                    f'<p><a href="{reset_url}">Şifrenizi sıfırlamak için buraya tıklayın</a></p>'
                    "<p>Bu bağlantı kısa süre içinde geçersiz olur. Talebi siz yapmadıysanız bu e-postayı yok sayabilirsiniz.</p>"
                ),
            }
        )
    except Exception:
        logger.exception("Failed to send password reset email to %s", to_email)


def send_verification_email(to_email: str, token: str) -> None:
    if not _email_is_configured():
        logger.warning(
            "Verification email skipped: RESEND_API_KEY or EMAIL_FROM is not configured."
        )
        return

    settings = get_settings()
    verify_url = f"{settings.frontend_url.rstrip('/')}/verify-email?token={token}"

    resend.api_key = settings.resend_api_key
    try:
        resend.Emails.send(
            {
                "from": settings.email_from,
                "to": [to_email],
                "subject": "DataWhisper e-posta doğrulama",
                "html": (
                    "<p>Merhaba,</p>"
                    "<p>DataWhisper hesabınızı oluşturduğunuz için teşekkürler.</p>"
                    f'<p><a href="{verify_url}">E-posta adresinizi doğrulamak için buraya tıklayın</a></p>'
                    "<p>Bu bağlantı kısa süre içinde geçersiz olur.</p>"
                ),
            }
        )
    except Exception:
        logger.exception("Failed to send verification email to %s", to_email)
