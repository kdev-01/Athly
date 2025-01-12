from fastapi import APIRouter, Depends, Query, Request, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import Optional, Annotated, List, Dict, Any
from pydantic import EmailStr
from src.api.deps import get_db
from src.models.user import User
from src.schemas.user import UserLogin, UserEmail, UserBase, ReadUser, DashboardData, CreateUser
from src.services.auth_service import AuthService
from src.services.email_service import EmailService

router = APIRouter()

@router.post('/login')
def login(
        user: UserLogin,
        db: Session = Depends(get_db)
    ):
    data = AuthService.authenticate_user(user.email, user.password, db)
    response = JSONResponse(
        content={"detail": "Inicio de sesión exitoso"}
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

@router.get('/verify/token')
def verify_token(
        authenticated: Annotated[bool, Depends(AuthService.verify_token)]
    ):
    
    if not authenticated:
        return {"detail": False}
    
    return {"detail": True}

@router.get('/profile')
def profile(
        user: Annotated[DashboardData, Depends(AuthService.get_user_profile)]
    ):
    return user

@router.post('/forgot/password')
async def forgot_password(
        user_email: UserEmail,
        db: Session = Depends(get_db)
    ):
    password = AuthService.generate_password(user_email.email, db)
    try:
        email_service = EmailService()
        await email_service.send_password_recovery(user_email.email, password)
    except Exception:
        raise HTTPException(status_code=500, detail="Ocurrió un error. Intenta nuevamente.")
    
    response = JSONResponse(
        content={"detail": "Se ha enviado un enlace para recuperar tu contraseña."}
    )

    return response

@router.post('/reset/password')
async def reset_password(
        request: Request,
        db: Session = Depends(get_db)
    ):
    try:
        body = await request.json()
        email = body.get("email")
        temporaryPassword = body.get("temporaryPassword")
        newPassword = body.get("newPassword")
        confirmPassword = body.get("confirmPassword")
        AuthService.change_password(email, temporaryPassword, newPassword, confirmPassword, db);
        response = JSONResponse(
            content={"detail": "La contraseña ha sido cambiada con exito."}
        )

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/', response_model=Dict[str, Any])
def create_user(user_schema: CreateUser, db: Session = Depends(get_db)):
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
