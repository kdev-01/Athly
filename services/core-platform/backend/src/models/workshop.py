from src.database.base_class import Base
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship

class Workshop(Base):
    __tablename__ = 'workshops'

    workshop_id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    location = Column(Text, nullable=False)
    date_time = Column(DateTime, nullable=False)
    description = Column(Text)

    attendees = relationship("WorkshopAttendance", back_populates="workshop")