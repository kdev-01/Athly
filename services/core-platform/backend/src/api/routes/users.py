from fastapi import APIRouter, Depends, Query, Request, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import Optional, Annotated, List, Dict, Any
from pydantic import EmailStr
from fastapi.security import OAuth2PasswordRequestForm
from src.api.deps import get_db
from src.models.user import User
from src.schemas.user import UserBase, ReadUser, DashboardData
from src.services.auth_service import AuthService

router = APIRouter()

@router.post('/login')
def login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        request: Request = None,
        db: Session = Depends(get_db)
    ):

    access_token = request.cookies.get("access_token")
    if not access_token:
        pass

    data = AuthService.authenticate_user(form_data.username, form_data.password, db)

    if not data:
        raise HTTPException(status_code=400, detail="Credenciales incorrectas. Verifique su correo o contraseña.")

    response = JSONResponse(
        content={"message": "Inicio de sesión exitoso"}
    )

    response.set_cookie(
        key="access_token",
        value=data['access_token'],
        httponly=True,
        samesite="Strict",
        secure=False,
        max_age=7 * 24 * 60 * 60
    )

    return response

@router.get('/profile')
def profile(
        user: Annotated[DashboardData, Depends(AuthService.get_user_profile)]
    ):
    return user







@router.post('/', response_model=Dict[str, Any])
def create_user(user_schema: UserBase, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user_schema.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(**user_schema.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"detail": "User created successfully"}

@router.get('/', response_model=List[ReadUser])
def get_user(
    db: Session = Depends(get_db),
    id: Optional[int] = Query(None, gt=0),
    name: Optional[str] = Query(None, min_length=3, max_length=50),
    email: EmailStr = None):

    query = db.query(User)

    if id:
        query = query.filter(User.user_id == id)
    if name:
        query = query.filter(func.lower(User.first_name) == name.lower())
    if email:
        query = query.filter(User.email == email)

    return query.all()

@router.put('/', response_model=Dict[str, Any])
def update_user(user_schema: UserBase, id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    for key, value in user_schema.model_dump().items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)

    return {"detail": "User updated successfully"}

@router.delete('/', response_model=Dict[str, Any])
def delete_user(id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"detail": "User deleted successfully"}
