from src.database.base_class import Base
from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship

class Event(Base):
    __tablename__ = "events"

    event_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    registration_start_date = Column(Date)
    registration_end_date = Column(Date)

    # Claves foráneas
    sport_id = Column(Integer, ForeignKey("sports.sport_id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.category_id"), nullable=False)

    # Relaciones
    sport = relationship("Sport", back_populates="events")  # Relación con Sport
    category = relationship("Category", back_populates="events")  # Relación con Category
    workshops = relationship("Workshop", back_populates="event")  # Relación con Workshop
    participants = relationship("EventParticipant", back_populates="event")  # Relación con Participantes
    venues = relationship("VenueEvent", back_populates="event")  # Relación con Escenarios Deportivos
