from src.database.base_class import Base
from sqlalchemy import Column, Integer, String, Boolean, Text, Date, ForeignKey
from sqlalchemy.orm import relationship

class Student(Base):
    __tablename__ = 'students'

    student_id = Column(Integer, primary_key=True)
    identification = Column(String(20), nullable=False)
    names = Column(String(70), nullable=False)
    surnames = Column(String(70), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    blood_type = Column(String(3))
    photo_url = Column(String(255), nullable=False)
    identification_filename = Column(String(150), nullable=False)
    authorization_filename = Column(String(150), nullable=False)
    enrollment_filename = Column(String(150), nullable=False)
    is_deleted = Column(Boolean, default=False)
    representative_id = Column(Integer, ForeignKey('representatives.representative_id'), nullable=False)
    gender_id = Column(Integer, ForeignKey('genders.gender_id'), nullable=False)
    academic_year_id = Column(Integer, ForeignKey('academic_years.academic_year_id'), nullable=False)

    representative = relationship("Representative", back_populates="students")
    gender = relationship("Gender", back_populates="students")
    academic_year = relationship("AcademicYear", back_populates="students")
    registrations = relationship("RegisteredStudent", back_populates="student")
