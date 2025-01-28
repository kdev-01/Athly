from sqlalchemy import Column, Integer, ForeignKey
from src.database.base_class import Base
from sqlalchemy.orm import relationship

class EventParticipant(Base):
    __tablename__ = "event_participants"

    # Claves primarias y foráneas (Muchos a Muchos)
    id_event = Column(Integer, ForeignKey("events.event_id"), primary_key=True, index=True)
    id_educational_institution = Column(Integer, ForeignKey("educational_institutions.institution_id"), primary_key=True, nullable=False)

    # Relaciones
    event = relationship("Event", back_populates="participants")  # Relación con Evento
    institution = relationship("EducationalInstitution", back_populates="events")  # Relación con Institución Educativa
