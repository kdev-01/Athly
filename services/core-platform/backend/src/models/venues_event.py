from src.database.base_class import Base
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

class VenueEvent(Base):
    __tablename__ = "venues_event"

    id_event = Column(Integer, ForeignKey("events.event_id"), primary_key=True, index=True)
    id_venue = Column(Integer, ForeignKey("sports_venues.venue_id"), primary_key=True, nullable=False)

    # Relaciones
    event = relationship("Event", back_populates="venues")  # Relación con eventos
    venue = relationship("SportsVenue", back_populates="events")  # Relación con escenarios deportivos
