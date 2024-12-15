from src.database.base_class import Base
from sqlalchemy import Column, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship

class FootballResult(Base):
    __tablename__ = 'football_results'

    football_result_id = Column(Integer, primary_key=True)
    goals = Column(Integer)
    assists = Column(Integer)
    yellow_cards = Column(Integer)
    red_cards = Column(Integer)
    status = Column(Boolean, default=False)
    student_id = Column(Integer, ForeignKey('students.student_id'))
    team_schedule_id = Column(Integer, ForeignKey('team_schedules.team_schedule_id'))

    student = relationship("Student")
    team_schedule = relationship("TeamSchedule")
