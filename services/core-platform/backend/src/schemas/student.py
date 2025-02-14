from pydantic import BaseModel
from typing import Optional
from datetime import date

class StudentBase(BaseModel):
    identification: str
    names: str
    surnames: str
    gender: str
    date_of_birth: date
    blood_type: str
    id_event: int

class RegisteredStudent(BaseModel):
    identification: str
    student_id: int
    id_event: int
    status: str
    description: Optional[str]
    