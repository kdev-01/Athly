from src.database.base_class import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Category(Base):
    __tablename__ = "categories"

    category_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    tournament_type = Column(String(50))
    max_age = Column(Integer)
    min_age = Column(Integer)

    events = relationship("Event", back_populates="category")  # Singular
    disciplines = relationship("Discipline", back_populates="category")
