from src.database.base_class import Base
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

class Workshop(Base):
    __tablename__ = 'workshops'

    workshop_id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    location = Column(Text, nullable=False)
    date_time = Column(DateTime, nullable=False)
    description = Column(Text)
    event_id = Column(Integer, ForeignKey('events.event_id'), nullable=False)  # Relación con eventos

    event = relationship("Event", back_populates="workshops")  # Relación con la tabla Event
    attendees = relationship("WorkshopAttendance", back_populates="workshop")  # Relación con WorkshopAttendance