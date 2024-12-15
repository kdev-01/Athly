from src.database.base_class import Base
from sqlalchemy import Column, Integer, Boolean, ForeignKey, Interval
from sqlalchemy.orm import relationship

class AthleticsResult(Base):
    __tablename__ = 'athletics_results'

    athletics_result_id = Column(Integer, primary_key=True)
    time_elapsed = Column(Interval)
    rank = Column(Integer)
    status = Column(Boolean, default=False)
    in_schedule_id = Column(Integer, ForeignKey('individual_schedules.in_schedule_id'))

    individual_schedule = relationship("IndividualSchedule")
