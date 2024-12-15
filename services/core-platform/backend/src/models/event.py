from src.database.base_class import Base
from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship

class Event(Base):
    __tablename__ = 'events'

    event_id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    registration_start_date = Column(Date)
    registration_end_date = Column(Date)
    sport_id = Column(Integer, ForeignKey('sports.sport_id'))

    sport = relationship("Sport", back_populates="events")
