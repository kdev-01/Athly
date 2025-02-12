from fastapi_mail import FastMail, ConnectionConfig, MessageSchema
from src.core.config import settings

class EmailService:
    def __init__(self):
        self.conf = ConnectionConfig(
            MAIL_USERNAME=settings.MAIL_USERNAME,
            MAIL_PASSWORD=settings.MAIL_PASSWORD,
            MAIL_FROM=settings.MAIL_FROM,
            MAIL_PORT=settings.MAIL_PORT,
            MAIL_SERVER=settings.MAIL_SERVER,
            MAIL_STARTTLS=settings.MAIL_STARTTLS,
            MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
            USE_CREDENTIALS=settings.USE_CREDENTIALS,
            VALIDATE_CERTS=settings.VALIDATE_CERTS
        )

    async def send_email(self, subject: str, email_to: str, body: str):
        message = MessageSchema(
            subject=subject,
            recipients=[email_to],
            body=body,
            subtype="html",
        )
        fm = FastMail(self.conf)
        await fm.send_message(message)
        return {"detail": "Correo enviado con éxito"}
    
    async def send_password_recovery(self, email_to: str, password: str):
        subject = "Recuperación de contraseña"
        body = f"""
        <!DOCTYPE html>
        <html>
            <body>
                <p>Hola,</p>
                <p>Aquí tienes una contraseña temporal:</p>
                <span>{password}</span>
                <p>Inicia sesión conjunto con tu correo electrónico.</p>
            </body>
        </html>
        """
        await self.send_email(subject, email_to, body)

    async def send_access_details(self, email_to: str, password: str):
        access_link = "http://localhost:5173/login"
        subject = "Detalles de acceso a la plataforma"
        body = f"""
        <!DOCTYPE html>
        <html>
            <body>
                <p>Hola,</p>
                <p>Nos complace informarte que ya tienes acceso a nuestra plataforma. Para ingresar, por favor utiliza el siguiente enlace:</p>
                <p><a href="{access_link}">{access_link}</a></p>
                <p>Para iniciar sesión, emplea tu correo electrónico (<strong>{email_to}</strong>) y la siguiente contraseña temporal:</p>
                <p><strong>{password}</strong></p>
                <p>Saludos cordiales,</p>
                <strong>Federación Deportiva Provincial Estudiantil de Napo<strong>
            </body>
        </html>
        """
        await self.send_email(subject, email_to, body)
