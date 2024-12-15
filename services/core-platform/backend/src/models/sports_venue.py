from src.database.base_class import Base
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship

class SportsVenue(Base):
    __tablename__ = 'sports_venues'

    venue_id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    location = Column(Text, nullable=False)
    image_url = Column(Text)
    status = Column(Boolean, default=False)
    sport_id = Column(Integer, ForeignKey('sports.sport_id'))

    sport = relationship("Sport", back_populates="venues")
