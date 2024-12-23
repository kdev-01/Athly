from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt
from sqlalchemy.orm import Session
from typing import Annotated
import os
from src.api.deps import get_db
from src.models.user import User
from src.crud.user import UserCRUD

oauth2_schema = OAuth2PasswordBearer(tokenUrl="/users/token")
secret_key = os.getenv('SECRET_KEY')
jwt_algorithm = os.getenv('ALGORITHM')

class AuthService:
    @staticmethod
    def encode_token(payload: dict) -> str:
        return jwt.encode(payload, secret_key, algorithm=jwt_algorithm)

    @staticmethod
    def decode_token(token: Annotated[str, Depends(oauth2_schema)], db: Session = Depends(get_db)) -> User:
        try:
            data = jwt.decode(token, secret_key, algorithms=[jwt_algorithm])
            user = UserCRUD.get_user_by_email(db, data.get("email"))
            if not user:
                raise HTTPException(status_code=401, detail="Usuario no autorizado")
            return user
        except jwt.JWTError:
            raise HTTPException(status_code=401, detail="Token inválido")

    @staticmethod
    def authenticate_user(form_data: OAuth2PasswordRequestForm, db: Session):
        user = UserCRUD.get_user_by_email(db, form_data.username)
        if not user or not AuthService.verify_password(form_data.password, user.password):
            return None
        token = AuthService.encode_token({"email": user.email})
        return {"access_token": token, "token_type": "bearer"}

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return plain_password == hashed_password
