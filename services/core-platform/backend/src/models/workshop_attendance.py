from src.database.base_class import Base
from sqlalchemy import Column, Integer, ForeignKey, Boolean
from sqlalchemy.orm import relationship

class WorkshopAttendance(Base):
    __tablename__ = 'workshop_attendance'

    user_id = Column(Integer, ForeignKey('users.user_id'), primary_key=True)
    workshop_id = Column(Integer, ForeignKey('workshops.workshop_id'), primary_key=True)
    status = Column(Boolean, default=False)

    user = relationship("User", back_populates="workshops")
    workshop = relationship("Workshop", back_populates="attendees")
