from src.database.base_class import Base
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

class Discipline(Base):
    __tablename__ = 'disciplines'

    discipline_id = Column(Integer, primary_key=True)
    type = Column(String(50), nullable=False)
    description = Column(Text)
    allowed_gender = Column(String(30), nullable=False)
    sport_id = Column(Integer, ForeignKey('sports.sport_id'))
    category_id = Column(Integer, ForeignKey('categories.category_id'))

    sport = relationship("Sport", back_populates="disciplines")
    category = relationship("Category", back_populates="disciplines")
