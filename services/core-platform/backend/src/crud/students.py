from typing import List, Optional

from sqlalchemy.orm import Session

from src.models.student import Student as StudentModel

def get_students(db: Session, skip: int = 0, limit: int = 100):
    return db.query(StudentModel).offset(skip).limit(limit).all()
