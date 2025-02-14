from typing import Optional
from pydantic import BaseModel
from datetime import date


class Student(BaseModel):
    student_id: int
    identification: str
    names: str
    surnames: str
    date_of_birth: date
    blood_type: Optional[str] = None
    photo_url: str
    identification_filename: str
    authorization_filename: str
    enrollment_filename: str
    is_deleted: bool
    representative_id: int # Asegúrate que los tipos coinciden con tu modelo de base de datos
    gender_id: int
    academic_year_id: int

    class Config:
        orm_mode = True  # Esto es muy importante para que Pydantic funcione con SQLAlchemy
