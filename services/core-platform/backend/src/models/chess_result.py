from src.database.base_class import Base
from sqlalchemy import Column, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship

class ChessResult(Base):
    __tablename__ = 'chess_results'

    chess_result_id = Column(Integer, primary_key=True)
    wins = Column(Integer)
    losses = Column(Integer)
    draws = Column(Integer)
    points = Column(Integer)
    status = Column(Boolean, default=False)
    in_schedule_id = Column(Integer, ForeignKey('individual_schedules.in_schedule_id'))

    individual_schedule = relationship("IndividualSchedule")
