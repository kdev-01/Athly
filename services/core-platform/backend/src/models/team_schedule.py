from src.database.base_class import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

class TeamSchedule(Base):
    __tablename__ = 'team_schedules'

    team_schedule_id = Column(Integer, primary_key=True)
    encounter_date = Column(DateTime, nullable=False)
    result = Column(String(130), nullable=False)
    
    institution_id1 = Column(Integer, ForeignKey('educational_institutions.institution_id'))
    institution_id2 = Column(Integer, ForeignKey('educational_institutions.institution_id'))
    venue_id = Column(Integer, ForeignKey('sports_venues.venue_id'))
    discipline_id = Column(Integer, ForeignKey('disciplines.discipline_id'))
    judge_id = Column(Integer, ForeignKey('judges.judge_id'))

    institution1 = relationship("EducationalInstitution", foreign_keys=[institution_id1])
    institution2 = relationship("EducationalInstitution", foreign_keys=[institution_id2])
    venue = relationship("SportsVenue")
    discipline = relationship("Discipline")
    judge = relationship("Judge")
