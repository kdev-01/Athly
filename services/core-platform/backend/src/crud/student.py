from sqlalchemy.orm import Session
from src.models.student import Student
from typing import Dict

class StudentCRUD:
    @staticmethod
    def student__exists(db: Session, identification: str) -> int:
        return db.query(Student.identification).filter(Student.identification == identification).scalar()
    
    @staticmethod
    def select_all_students(db: Session) -> list[Student]:
        result = db.query(Student).filter(Student.is_deleted == False).all()
        return result

    @staticmethod
    def insert_student(db: Session, student: Dict):
        new_student = Student(**student)
        db.add(new_student)
        db.commit()
        db.refresh(new_student)
        return new_student
    