from src.database.base_class import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Gender(Base):
    __tablename__ = 'genders'

    gender_id = Column(Integer, primary_key=True)
    type = Column(String(20), nullable=False)

    students = relationship("Student")
