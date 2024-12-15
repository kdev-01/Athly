from src.database.base_class import Base
from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship

class EducationalInstitution(Base):
    __tablename__ = 'educational_institutions'

    institution_id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    address = Column(Text, nullable=False)

    representatives = relationship("Representative", back_populates="institution")
