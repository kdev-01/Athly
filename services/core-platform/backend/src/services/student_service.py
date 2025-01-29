from fastapi import HTTPException
from sqlalchemy.orm import Session
from pathlib import Path
from datetime import date
from src.crud.student import StudentCRUD
from src.crud.representative import RepresentativeCRUD
from src.crud.gender import GenderCRUD
import os
import base64

class StudentService:
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
        db: Session,
        user_credentials: dict
    ):
        if StudentCRUD.student__exists(db, identification):
            raise HTTPException(status_code=400, detail="El estudiante ya está inscrito")

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
            "status": "Pendiente",
            "representative_id": representative_id,
            "gender_id": gender_id,
            "academic_year_id": 1
        }

        StudentCRUD.insert_student(db, student_data)
    
    @staticmethod
    def read_pdf(filename):
        base_path = Path(__file__).resolve().parents[2]
        path_files = base_path / "documents" / "students" / filename

        if os.path.exists(path_files):
            with open(path_files, "rb") as pdf:
                return base64.b64encode(pdf.read()).decode("utf-8")
        return None
    
    @staticmethod
    def get_list_student(
        db: Session
    ):
        students = StudentCRUD.select_all_students(db)
        serialized_students = [
            {
                "student_id": student.student_id,
                "identification": student.identification,
                "names": student.names,
                "surnames": student.surnames,
                "date_of_birth": student.date_of_birth.isoformat(),  # Serializar fechas
                "blood_type": student.blood_type,
                "photo_url": student.photo_url,
                "status": student.status,
                "representative_id": student.representative_id,
                "gender_id": student.gender_id,
                "academic_year_id": student.academic_year_id,
                "identification_pdf": StudentService.read_pdf(student.identification_filename),
                "authorization_pdf": StudentService.read_pdf(student.authorization_filename),
                "enrollment_pdf": StudentService.read_pdf(student.enrollment_filename)
            }
            for student in students
        ]
        
        return serialized_students
    