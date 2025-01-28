from src.database.base_class import Base
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

class SportsVenue(Base):
    __tablename__ = "sports_venues"

    venue_id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    location = Column(Text, nullable=False)
    image_url = Column(Text)

    # Clave foránea
    sport_id = Column(Integer, ForeignKey("sports.sport_id"), nullable=False)

    # Relación con Sport
    sport = relationship("Sport", back_populates="venues")
    events = relationship("VenueEvent", back_populates="venue") 
