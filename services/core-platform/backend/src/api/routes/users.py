from pydantic import EmailStr
from fastapi import APIRouter, Depends, Form, Request, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List
from typing_extensions import Annotated
from src.api.deps import get_db
from src.schemas.user import UserCredentials, UserEmail, GetUser, AddUser
from src.utils.decorators import requires_role
from src.utils.responses import standard_response
from src.services.auth_service import AuthService
from src.services.email_service import EmailService
from src.services.user_service import UserService

router = APIRouter()

@router.get('/auth/check')
def auth_check(
        user_credentials: dict = Depends(AuthService.decode_token)
    ):
    return standard_response(
        success=True,
        message="Bienvenido."
    )

@router.post('/login')
def login(
        user: UserCredentials,
        db: Session = Depends(get_db)
    ):
    data = AuthService.authenticate_user(user.email, user.password, db)

    response = JSONResponse(
        content=standard_response(
            success=True,
            message="Inicio de sesión exitoso."
        )
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

@router.post('/register/data')
async def register_user_data(
        first_name: Annotated[str, Form(..., min_length=3, max_length=50)],
        last_name: Annotated[str, Form(..., min_length=3, max_length=50)],
        email: Annotated[EmailStr, Form(...)],
        phone: Annotated[str, Form(..., min_length=10, max_length=14)],
        photo: UploadFile | None = None,
        db: Session = Depends(get_db)
    ):
    try:
        profile_image = None
        filename = None
        if photo:
            if photo.content_type not in ["image/png", "image/jpeg"]:
                raise HTTPException(status_code=400, detail="Tipo de archivo no permitido")
            
            filename = photo.filename
            profile_image = await photo.read()

        UserService.register_data(profile_image, filename, first_name, last_name, email, phone, db)
        return standard_response(
            success=True,
            message="Se han agregado a los usuarios correctamente.",
        )
    except ValueError as e:
        return standard_response(
            success=False,
            message=f"Error en la carga de datos: {str(e)}",
        )
    except Exception as e:
        return standard_response(
            success=False,
            message="Error interno del servidor.",
            data={"error": str(e)},
        )

@router.post('/forgot/password')
async def forgot_password(
        user_email: UserEmail,
        db: Session = Depends(get_db)
    ):
    password = AuthService.save_password(user_email.email, db)

    try:
        email_service = EmailService()
        await email_service.send_password_recovery(user_email.email, password)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    response = JSONResponse(
        content=standard_response(
            success=True,
            message="Se ha enviado un enlace para recuperar tu contraseña."
        )
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    response = JSONResponse(
        content=standard_response(
            success=True,
            message="La contraseña ha sido cambiada con exito."
        )
    )

    return response

@router.get('/profile')
def profile(
        db: Session = Depends(get_db),
        user_credentials: dict = Depends(AuthService.decode_token)
    ):
    user = UserService.get_user_profile(db)

    return user

@router.get('/get/users')
@requires_role("Administrador")
def get_users(
        db: Session = Depends(get_db),
        user_credentials: dict = Depends(AuthService.decode_token)
    ) -> list[GetUser]:
    users = UserService.get_users(db)
    
    response = JSONResponse(
        content=standard_response(
            success=True,
            message="",
            data=users
        )
    )

    return response

@router.post('/load/users')
@requires_role("Administrador")
async def mass_load_users(
        users: List[AddUser],
        db: Session = Depends(get_db),
        user_credentials: dict = Depends(AuthService.decode_token)
    ):
    try:
        data = [user.model_dump() for user in users]
        results = await UserService.load_users(data, db)

        return standard_response(
            success=True,
            message="Se han agregado a los usuarios correctamente.",
            data=results
        )
    except ValueError as e:
        return standard_response(
            success=False,
            message=f"Error en la carga masiva: {str(e)}",
        )
    except Exception as e:
        return standard_response(
            success=False,
            message="Error interno del servidor.",
            data={"error": str(e)},
        )

@router.get('/actions')
def get_role_actions(
        db: Session = Depends(get_db),
        user_credentials: dict = Depends(AuthService.decode_token)
    ):
    try:
        results = UserService.get_actions(user_credentials, db)
        return standard_response(
            success=True,
            message="",
            data=results
        )
    except ValueError as e:
        return standard_response(
            success=False,
            message=f"Error al obtener las acciones: {str(e)}",
        )
    except Exception as e:
        return standard_response(
            success=False,
            message="Error interno del servidor.",
            data={"error": str(e)},
        )
    