from src.database.base_class import Base
from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship

class IndividualSchedule(Base):
    __tablename__ = 'individual_schedules'

    in_schedule_id = Column(Integer, primary_key=True)
    schedule_date = Column(DateTime, nullable=False)
    
    discipline_id = Column(Integer, ForeignKey('disciplines.discipline_id'))
    venue_id = Column(Integer, ForeignKey('sports_venues.venue_id'))
    student_id = Column(Integer, ForeignKey('students.student_id'))
    judge_id = Column(Integer, ForeignKey('judges.judge_id'))

    discipline = relationship("Discipline")
    venue = relationship("SportsVenue")
    student = relationship("Student")
    judge = relationship("Judge")
