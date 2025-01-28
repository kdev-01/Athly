from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse, FileResponse
from sqlalchemy.orm import Session
from datetime import date
from src.api.deps import get_db
from src.services.auth_service import AuthService
from src.services.student_service import StudentService
from src.utils.responses import standard_response
from src.utils.decorators import requires_role
from src.utils.rules import MAX_IMAGE_SIZE, MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES, ALLOWED_DOCUMENT_TYPES
from src.utils.verify_data import validate_file, validate_identification, validate_name
import re

from pathlib import Path
import os

router = APIRouter()

@router.post('/load')
@requires_role("Institución educativa")
async def register_student(
        photo: UploadFile,
        copy_identification: UploadFile,
        authorization: UploadFile,
        enrollment: UploadFile,
        identification: str = Form(...),
        names: str = Form(...),
        surnames: str = Form(...),
        gender: str = Form(...),
        date_of_birth: date = Form(...),
        blood_type: str | None = Form(None),
        db: Session = Depends(get_db),
        user_credentials: dict = Depends(AuthService.decode_token)
    ):
    await validate_file(photo, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE)
    for file in [copy_identification, authorization, enrollment]:
        await validate_file(file, ALLOWED_DOCUMENT_TYPES, MAX_FILE_SIZE)
    
    validate_identification(identification)
    validate_name(names)
    validate_name(surnames)
    if not re.match(r"^(A|B|AB|O)[+-]$", blood_type):
        raise HTTPException(
            status_code=400,
            detail=(
                "El formato del grupo sanguíneo no es válido. "
                "Debe ser uno de: A+, A-, B+, B-, AB+, AB-, O+, O-."
            ),
        )
    
    photo_profile = await photo.read()
    photo_name = photo.filename
    identification_file = await copy_identification.read()
    authorization_file = await authorization.read()
    enrollment_file = await enrollment.read()

    await StudentService.register_student(
        identification,
        names,
        surnames,
        gender,
        date_of_birth,
        blood_type,
        photo_profile,
        photo_name,
        identification_file,
        authorization_file,
        enrollment_file,
        db,
        user_credentials
    )

    response = JSONResponse(
        content=standard_response(
            success=True,
            message="El estudiante se agrego correctamente."
        )
    )

    return response

@router.get('/get')
@requires_role("Administrador")
def get_students(
        db: Session = Depends(get_db),
        user_credentials: dict = Depends(AuthService.decode_token)
    ):
    result = StudentService.get_list_student(db)

    response = JSONResponse(
        content=standard_response(
            success=True,
            message="Los estudiantes se obtuvieron con éxito",
            data=result
        )
    )

    return response
