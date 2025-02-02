from src.database.base_class import Base
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class RegisteredStudent(Base):
    __tablename__ = "registered_student"

    student_id = Column(Integer, ForeignKey("students.student_id"), primary_key=True, nullable=False)
    id_event = Column(Integer, ForeignKey("events.event_id"), primary_key=True, nullable=False)
    status = Column(String(15), nullable=False)
    description = Column(Text, nullable=True)
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    event = relationship("Event", back_populates="students")
    student = relationship("Student", back_populates="registrations")
