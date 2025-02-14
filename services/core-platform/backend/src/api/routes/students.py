from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import date
from src.api.deps import get_db
from src.services.auth_service import AuthService
from src.services.student_service import StudentService
from src.schemas.student import StudentBase, RegisteredStudent
from src.utils.responses import standard_response
from src.utils.decorators import requires_role
from src.utils.rules import MAX_IMAGE_SIZE, MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES, ALLOWED_DOCUMENT_TYPES
from src.utils.verify_data import validate_file, validate_identification, validate_name, validate_blood_type

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
        event_id: int = Form(...),
        db: Session = Depends(get_db),
        user_credentials: dict = Depends(AuthService.decode_token)
    ):
    await validate_file(photo, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE)
    for file in [copy_identification, authorization, enrollment]:
        await validate_file(file, ALLOWED_DOCUMENT_TYPES, MAX_FILE_SIZE)
    
    #validate_identification(identification)
    validate_name(names)
    validate_name(surnames)
    validate_blood_type(blood_type)
    
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
        event_id,
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

@router.post('/update')
@requires_role("Administrador")
def update_student(
        student_data: StudentBase,
        db: Session = Depends(get_db),
        user_credentials: dict = Depends(AuthService.decode_token)
    ):

    #validate_identification(student_data.identification)
    validate_name(student_data.names)
    validate_name(student_data.surnames)
    validate_blood_type(student_data.blood_type)

    StudentService.update_information_student(
        student_data.identification,
        student_data.names,
        student_data.surnames,
        student_data.gender,
        student_data.date_of_birth,
        student_data.blood_type,
        student_data.id_event,
        db
    )

    response = JSONResponse(
        content=standard_response(
            success=True,
            message="La información se actualizo con éxito."
        )
    )

    return response

@router.get('/get')
@requires_role("Administrador")
async def get_student_documents(
        student_id: int,
        db: Session = Depends(get_db),
        user_credentials: dict = Depends(AuthService.decode_token)
    ):
    result = await StudentService.get_student_documents(student_id, db)

    response = JSONResponse(
        content=standard_response(
            success=True,
            message="",
            data=result
        )
    )

    return response

@router.post('/status')
@requires_role("Administrador")
def set_registration_student(
        registration_data: RegisteredStudent,
        db: Session = Depends(get_db),
        user_credentials: dict = Depends(AuthService.decode_token)
    ):
    valid_statuses = ["Aprobado", "Rechazado"]
    if registration_data.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail="El estado solo puede ser Aprobado o Rechazado."
        )
    
    if registration_data.status == "Rechazado" and not registration_data.description:
        raise HTTPException(
            status_code=400,
            detail="Para el estado 'Rechazado', se requiere una descripción."
        )

    StudentService.update_registration_student(
        registration_data.identification,
        registration_data.student_id,
        registration_data.id_event,
        registration_data.status,
        registration_data.description if registration_data.status == "Rechazado" else None,
        db
    )

    response = JSONResponse(
        content=standard_response(
            success=True,
            message="El estudiante ahora se encuentra inscrito en el evento."
        )
    )

    return response

@router.post('/set/documents')
@requires_role("Institución educativa")
async def set_documents_student(
        student_id: int = Form(...),
        id_event: int = Form(...),
        photo: UploadFile | None = None,
        copy_identification: UploadFile | None = None,
        authorization: UploadFile | None = None,
        enrollment: UploadFile | None = None,
        db: Session = Depends(get_db),
        user_credentials: dict = Depends(AuthService.decode_token)
    ):
    if photo:
        await validate_file(photo, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE)
    for file in [copy_identification, authorization, enrollment]:
        if file:
            await validate_file(file, ALLOWED_DOCUMENT_TYPES, MAX_FILE_SIZE)

    photo_profile = await photo.read() if photo else None
    photo_name = photo.filename if photo else None
    identification_file = await copy_identification.read() if copy_identification else None
    authorization_file = await authorization.read() if authorization else None
    enrollment_file = await enrollment.read() if enrollment else None

    await StudentService.update_documents_student(
        student_id,
        id_event,
        photo_profile,
        photo_name,
        identification_file,
        authorization_file,
        enrollment_file,
        db
    )

    return JSONResponse(
        content=standard_response(
            success=True,
            message="Los cambios se realizaron con éxito."
        )
    )
