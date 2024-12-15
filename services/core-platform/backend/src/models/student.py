from src.database.base_class import Base
from sqlalchemy import Column, Integer, String, Boolean, Text, Date, ForeignKey
from sqlalchemy.orm import relationship

class Student(Base):
    __tablename__ = 'students'

    student_id = Column(Integer, primary_key=True)
    identification = Column(String(20), unique=True, nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    academic_grade = Column(String(10), nullable=False)
    blood_type = Column(String(3))
    photo_url = Column(Text, nullable=False)
    identification_url = Column(Text, nullable=False)
    authorization_url = Column(Text, nullable=False)
    enrollment_url = Column(Text, nullable=False)
    status = Column(Boolean, default=False)
    representative_id = Column(Integer, ForeignKey('representatives.representative_id'))
    gender_id = Column(Integer, ForeignKey('genders.gender_id'))
    academic_year_id = Column(Integer, ForeignKey('academic_years.academic_year_id'))

    representative = relationship("Representative", back_populates="students")
    gender = relationship("Gender")
    academic_year = relationship("AcademicYear")
