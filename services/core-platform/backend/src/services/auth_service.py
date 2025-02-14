from fastapi import Depends, Request, HTTPException
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import datetime, timezone, timedelta
from src.utils.responses import standard_response
from src.core.config import settings
from src.api.deps import get_db
from src.crud.user import UserCRUD
import random
import string

secret_key = settings.SECRET_KEY
jwt_algorithm = settings.ALGORITHM

class AuthService:
    @staticmethod
    def get_cookie(request: Request):
        access_token = request.cookies.get("access_token")

        if not access_token:
            raise HTTPException(status_code=401, detail="Por favor, inicie sesión.")
        return access_token
            
    @staticmethod
    def decode_token(
        access_token: str = Depends(get_cookie),
        db: Session = Depends(get_db)
    ) -> dict:
        try:

            if not access_token:
                 raise HTTPException(status_code=401, detail="No tiene permisos para acceder al sistema.")

            payload = jwt.decode(access_token, secret_key, algorithms=[jwt_algorithm])
            email = payload.get("email")
            role = payload.get("role")

            if not email:
                raise HTTPException(status_code=401, detail=standard_response(success=False,
                                                                              message="No tiene permisos para acceder al sistema."))
            
            user = UserCRUD.get_user_by_email(db, email)
            if not user or user.is_deleted == True:
                raise HTTPException(status_code=401, detail=standard_response(success=False,
                                                                              message="No tiene permisos para acceder al sistema."))
            
            return { "email": user.email, "role": role }
        
        except JWTError:
            raise HTTPException(status_code=500, detail="Ha ocurrido un error, por favor inténtelo mas tarde.")
    
    @staticmethod
    def encode_token(
        payload: dict,
        expires_delta: timedelta
    ) -> str:
        payload.update({
            "exp": datetime.now(timezone.utc).replace(tzinfo = None) + expires_delta
        })
        token = jwt.encode(payload, secret_key, algorithm = jwt_algorithm)
        return token
    
    @staticmethod
    def verify_password(
        plain_password: str,
        hashed_password: str
    ) -> bool:
        return plain_password == hashed_password
    
    @staticmethod
    def authenticate_user(
        email: str,
        password: str,
        db: Session
    ) -> dict:
        user = UserCRUD.get_userole_credentials(db, email)

        if not user or not AuthService.verify_password(password, user[1]):
            raise HTTPException(status_code=400, detail="Credenciales incorrectas. Verifique su correo o contraseña.")
        
        if user[3] == "S/N" or user[4] == "S/A":
            raise HTTPException(
                status_code=403, 
                detail="Actualización  requerida."
            )

        if user[2]:
            raise HTTPException(
                status_code=403, 
                detail="Cambio requerido."
            )
        
        access_token = AuthService.encode_token(
            {"email": user[0], "role": user[5]},
            timedelta(days=7)
        )

        return {"access_token": access_token}
    
    @staticmethod
    def generate_password() -> str:
        characters = string.ascii_letters + string.digits + string.punctuation
        password = ''.join(random.choice(characters) for _ in range(15))
        expiration_time = datetime.now(timezone.utc).replace(tzinfo = None) + timedelta(hours=24)
        expiration_str = expiration_time.strftime('%d%H%M')
        scrambled_expiration = ''.join(random.sample(expiration_str, len(expiration_str)))
        new_password = password + scrambled_expiration
        
        return new_password
    
    @staticmethod
    def save_password(
        email: str,
        db: Session
    ) -> str:
        user_email = UserCRUD.email_exists(db, email)

        if not user_email:
            raise HTTPException(status_code=403, detail="No se encuentra registrado en el sistema.")
        
        new_password = AuthService.generate_password()
        UserCRUD.change_password(db, user_email, new_password, is_temporary=True)

        return new_password

    @staticmethod
    def change_password(
        email: str,
        temporaryPassword: str,
        newPassword: str,
        confirmPassword: str,
        db: Session
    ) -> dict:
        user = UserCRUD.get_user_by_email(db, email)

        if not user:
            raise HTTPException(status_code=403, detail="No se encuentra registrado en el sistema.")
        if user.password != temporaryPassword:
            raise HTTPException(status_code=401, detail="La contraseña no concuerda con la proporcionada por correo.")
        if newPassword != confirmPassword:
            raise HTTPException(status_code=401, detail="Las contraseñas proporcionadas no coinciden.")
        UserCRUD.change_password(db, user.email, confirmPassword, is_temporary=False)
    