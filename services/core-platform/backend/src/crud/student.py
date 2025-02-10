from sqlalchemy.orm import Session
from src.models.student import Student
from src.models.registered_student import RegisteredStudent
from typing import Dict

class StudentCRUD:
    @staticmethod
    def is_student_registered_in_event(db: Session, identification: str, id_event: int) -> bool:
        return db.query(RegisteredStudent.student_id).join(
            Student, Student.student_id == RegisteredStudent.student_id
        ).filter(
            Student.identification == identification,
            RegisteredStudent.id_event == id_event
        ).first() is not None
    
    @staticmethod
    def get_student_registration(db: Session, student_id: int, id_event: int):
        return db.query(RegisteredStudent).join(Student, Student.student_id == RegisteredStudent.student_id).filter(
            Student.student_id == student_id,
            RegisteredStudent.id_event == id_event
        ).first()
    
    @staticmethod
    def update_registration(db: Session, registration: RegisteredStudent):
        db.add(registration)
        db.commit()
        db.refresh(registration)

    @staticmethod
    def get_student_id(db: Session, identification: str):
        student_id = db.query(Student.student_id).outerjoin(
            RegisteredStudent, RegisteredStudent.student_id == Student.student_id
        ).filter(
            Student.identification == identification,
            RegisteredStudent.student_id == None
        ).first()

        return student_id[0]
    
    @staticmethod
    def get_student(db: Session, identification: str, id_event: int):
        student = db.query(Student).join(
            RegisteredStudent, RegisteredStudent.student_id == Student.student_id
        ).filter(
            Student.identification == identification,
            RegisteredStudent.id_event == id_event
        ).first()

        return student
    
    @staticmethod
    def get_student_by_id(db: Session, student_id):
        student = db.query(Student).filter(Student.student_id == student_id).first()
        return student

    @staticmethod
    def select_documents_student(db: Session, student_id: int):
        result = db.query(
            Student.identification_filename,
            Student.authorization_filename,
            Student.enrollment_filename
            ).filter(
                Student.is_deleted == False,
                Student.student_id == student_id
            ).first()
        
        return result

    @staticmethod
    def insert_student(db: Session, student: Dict):
        new_student = Student(**student)
        db.add(new_student)
        db.commit()
        db.refresh(new_student)
    
    @staticmethod
    def update_student(db: Session, student: Student):
        db.add(student)
        db.commit()
        db.refresh(student)

    @staticmethod
    def insert_registration(db: Session, data: Dict):
        new_registration = RegisteredStudent(**data)
        db.add(new_registration)
        db.commit()
        db.refresh(new_registration)
        