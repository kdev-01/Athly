from src.database.base_class import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Sport(Base):
    __tablename__ = "sports"

    sport_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)

    events = relationship("Event", back_populates="sport")  # Relación con eventos
    venues = relationship("SportsVenue", back_populates="sport")
