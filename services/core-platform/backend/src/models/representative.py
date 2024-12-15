from src.database.base_class import Base
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

class Representative(Base):
    __tablename__ = 'representatives'

    representative_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    institution_id = Column(Integer, ForeignKey('educational_institutions.institution_id'), nullable=False)

    user = relationship("User", back_populates="representative")
    institution = relationship("EducationalInstitution", back_populates="representatives")
    students = relationship("Student", back_populates="representative")
