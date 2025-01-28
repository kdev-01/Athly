from src.database.base_class import Base
from sqlalchemy import Column, Integer, Date
from sqlalchemy.orm import relationship

class AcademicYear(Base):
    __tablename__ = 'academic_years'

    academic_year_id = Column(Integer, primary_key=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    
    students = relationship("Student", back_populates="academic_year")
