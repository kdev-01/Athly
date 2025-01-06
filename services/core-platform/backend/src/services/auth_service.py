from fastapi import Depends, Request, HTTPException
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
import os
from src.api.deps import get_db
from src.crud.user import UserCRUD
from src.schemas.user import DashboardData

load_dotenv()
secret_key = os.getenv('SECRET_KEY')
jwt_algorithm = os.getenv('ALGORITHM')

class AuthService:
    @staticmethod
    def get_cookie(request: Request):
        access_token = request.cookies.get("access_token")
        if not access_token:
            raise HTTPException(status_code=401, detail="La sesión ha caducado, por favor inicie sesión de nuevo")
        return access_token
    
    @staticmethod
    def decode_token(
        access_token: str = Depends(get_cookie),
        db: Session = Depends(get_db)
    ) -> dict:
        try:
            payload = jwt.decode(access_token, secret_key, algorithms=[jwt_algorithm])
            email = payload.get("email")

            if not email:
                raise HTTPException(status_code=401, detail="Not authorized")
            
            user = UserCRUD.get_user_by_email(db, email)
            if not user:
                raise HTTPException(status_code=401, detail="Not authorized")
            
            return { "email": user.email }
        
        except JWTError:
            raise HTTPException(status_code=401, detail="Por favor inicie sesión")
        
    @staticmethod
    def authenticate_user(
        email: str,
        password: str,
        db: Session
    ) -> dict:
        user = UserCRUD.get_user_by_email(db, email)

        if not user or not AuthService.verify_password(password, user.password):
            return None
        
        access_token = AuthService.encode_token(
            {"email": user.email}, 
            timedelta(days=7)
        )
        
        return {"access_token": access_token}
    
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
    def get_user_profile(
        db: Session = Depends(get_db),
        user: dict = Depends(decode_token)
    ) -> DashboardData:
        user_data = UserCRUD.get_user_by_email(db, user["email"])

        return user_data
