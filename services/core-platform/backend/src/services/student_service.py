from typing import Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session
from pathlib import Path
from datetime import date
from src.crud.student import StudentCRUD
from src.crud.representative import RepresentativeCRUD
from src.crud.gender import GenderCRUD
from src.crud.event import get_event_by_id
from src.crud.category import get_categories
import os
import base64

class StudentService:
    @staticmethod
    def calculate_age(date_of_birth: date) -> int:
        today = date.today()
        age = today.year - date_of_birth.year - ((today.month, today.day) < (date_of_birth.month, date_of_birth.day))
        return age
    
    @staticmethod
    async def register_student(
        identification: str,
        names: str,
        surnames: str,
        gender: str,
        date_of_birth: date,
        blood_type: str,
        photo_profile: bytes,
        photo_name: str,
        identification_file: bytes,
        authorization_file: bytes,
        enrollment_file: bytes,
        event_id: int,
        db: Session,
        user_credentials: dict
    ):
        is_registered = StudentCRUD.is_student_registered_in_event(db, identification, event_id)
        if is_registered:
            raise HTTPException(status_code=400, detail="El estudiante ya está inscrito en el evento.")
        
        event = get_event_by_id(db, event_id)
        if not event:
            raise HTTPException(status_code=400, detail="No se encontró el evento. Verifique la información e inténtelo nuevamente.")
        
        categories = {c.name: (c.min_age, c.max_age) for c in get_categories(db)}
        age = StudentService.calculate_age(date_of_birth)
        category_ranges = {
            "Inferior": (categories.get("Inferior", (13, 14))),
            "Intermedio": (categories.get("Intermedio", (15, 16))),
            "Superior": (categories.get("Superior", (17, 18))),
        }

        if event.category.name in category_ranges:
            min_age, max_age = category_ranges[event.category.name]
            if not (min_age <= age <= max_age):
                raise HTTPException(status_code=400, detail=f"La edad no corresponde a la categoría {event.category.name} ({min_age}-{max_age} años)")
        
        representative_id = RepresentativeCRUD.representative_exists(db, user_credentials.get("email"))
        gender_id = GenderCRUD.get_gender_id(db, gender)

        files = {
            "identification": identification_file,
            "authorization": authorization_file,
            "enrollment": enrollment_file,
        }
        filenames = {}

        base_path = Path(__file__).resolve().parents[2]
        path_files = base_path / "documents" / "students"

        try:
            for file_key, file_obj in files.items():
                filename = f"{file_key}_{identification}.pdf"
                filenames[file_key] = filename
                file_path = path_files / filename

                with open(file_path, "wb") as f:
                    f.write(file_obj)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error al guardar: {str(e)}")
        
        extension = Path(photo_name).suffix
        filename = f"st{identification}{extension}"
        path_image = base_path / "images" / "profile" / filename

        try:
            with open(path_image, "wb") as f:
                f.write(photo_profile)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error al guardar la imagen: {str(e)}")

        try:
            student_data = {
                "identification": identification,
                "names": names,
                "surnames": surnames,
                "date_of_birth": date_of_birth,
                "blood_type": blood_type,
                "photo_url": f"http://127.0.0.1:8000/images/profile/{filename}",
                "identification_filename": filenames["identification"],
                "authorization_filename": filenames["authorization"],
                "enrollment_filename": filenames["enrollment"],
                "representative_id": representative_id,
                "gender_id": gender_id,
                "academic_year_id": 1
            }

            StudentCRUD.insert_student(db, student_data)
            
            student_id = StudentCRUD.get_student_id(db, identification)
            registration_data = {
                "student_id": student_id,
                "id_event": event_id,
                "status": "Pendiente",
            }
            StudentCRUD.insert_registration(db, registration_data)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error al registrar estudiante: {str(e)}")

    @staticmethod
    async def read_pdf(filename):
        base_path = Path(__file__).resolve().parents[2]
        path_files = base_path / "documents" / "students" / filename

        if os.path.exists(path_files):
            with open(path_files, "rb") as pdf:
                return base64.b64encode(pdf.read()).decode("utf-8").replace("\n", "")
        return None
    
    @staticmethod
    async def get_student_documents(
        student_id: int,
        db: Session
    ):
        student_documents = StudentCRUD.select_documents_student(db, student_id)

        if not student_documents:
            raise HTTPException(status_code=400, detail="No se encontraron los documentos del estudiante.")
        
        return {
            "identification_pdf": await StudentService.read_pdf(student_documents.identification_filename),
            "authorization_pdf": await StudentService.read_pdf(student_documents.authorization_filename),
            "enrollment_pdf": await StudentService.read_pdf(student_documents.enrollment_filename)
        }
    
    @staticmethod
    def update_information_student(
        identification: str,
        names: str,
        surnames: str,
        gender: str,
        date_of_birth: date,
        blood_type: str,
        id_event: int,
        db: Session
    ):
        event = get_event_by_id(db, id_event)
        if not event:
            raise HTTPException(status_code=400, detail="No se encontró el evento. Verifique la información e inténtelo nuevamente.")
        
        categories = {c.name: (c.min_age, c.max_age) for c in get_categories(db)}
        age = StudentService.calculate_age(date_of_birth)
        category_ranges = {
            "Inferior": (categories.get("Inferior", (13, 14))),
            "Intermedio": (categories.get("Intermedio", (15, 16))),
            "Superior": (categories.get("Superior", (17, 18))),
        }

        if event.category.name in category_ranges:
            min_age, max_age = category_ranges[event.category.name]
            if not (min_age <= age <= max_age):
                raise HTTPException(status_code=400, detail=f"La edad no corresponde a la categoría {event.category.name} ({min_age}-{max_age} años)")
            
        student = StudentCRUD.get_student(db, identification, id_event)
        student.names = names
        student.surnames = surnames
        gender_id = GenderCRUD.get_gender_id(db, gender)
        student.gender_id = gender_id
        student.date_of_birth = date_of_birth
        student.blood_type = blood_type

        StudentCRUD.update_student(db, student)

    @staticmethod
    def update_registration_student(
        identification: str,
        student_id: int,
        id_event: int,
        status: str,
        description: Optional[str],
        db: Session
    ):
        print(identification, student_id, id_event, status, description)
        is_registered = StudentCRUD.is_student_registered_in_event(db, identification, id_event)
        print(is_registered)

        if not is_registered:
            raise HTTPException(
                status_code=400, 
                detail="El estudiante con la identificación proporcionada no está registrado en el evento seleccionado. Por favor, verifique los datos."
            )
        
        registration = StudentCRUD.get_student_registration(db, student_id, id_event)
        registration.status = status
        if status == "Rechazado" and description:
            registration.description = description
            
        StudentCRUD.update_registration(db, registration)

    @staticmethod
    async def update_documents_student(
        student_id: int,
        id_event: int,
        photo_profile: Optional[bytes],
        photo_name: Optional[str],
        identification_file: Optional[bytes],
        authorization_file: Optional[bytes],
        enrollment_file: Optional[bytes],
        db: Session
    ):
        student = StudentCRUD.get_student_by_id(db, student_id)
        if not student:
            raise HTTPException(
                status_code=400, 
                detail="El estudiante no está registrado en el evento seleccionado. Por favor, verifique los datos."
            )

        base_path = Path(__file__).resolve().parents[2]
        path_files = base_path / "documents" / "students"
        filenames = {}

        for file_key, file_obj in {
            "identification": identification_file,
            "authorization": authorization_file,
            "enrollment": enrollment_file
        }.items():
            if file_obj:
                filename = f"{file_key}_{student.identification}.pdf"
                filenames[file_key] = filename
                file_path = path_files / filename
                try:
                    with open(file_path, "wb") as f:
                        f.write(file_obj)
                except Exception as e:
                    raise HTTPException(status_code=500, detail=f"Error al guardar {file_key}: {str(e)}")
                
        if photo_profile and photo_name:
            extension = Path(photo_name).suffix
            filename = f"st{student.identification}{extension}"
            path_image = base_path / "images" / "profile" / filename
            try:
                with open(path_image, "wb") as f:
                    f.write(photo_profile)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error al guardar la imagen: {str(e)}")
            
            student.photo_url = f"http://127.0.0.1:8000/images/profile/{filename}",
            
        if "identification" in filenames:
            student.identification_filename = filenames["identification"]
        if "authorization" in filenames:
            student.authorization_filename = filenames["authorization"]
        if "enrollment" in filenames:
            student.enrollment_filename = filenames["enrollment"]

        StudentCRUD.update_student(db, student)

        registration = StudentCRUD.get_student_registration(db, student_id, id_event)
        if registration:
            registration.status = "Pendiente"
            registration.description = None
            StudentCRUD.update_registration(db, registration)
