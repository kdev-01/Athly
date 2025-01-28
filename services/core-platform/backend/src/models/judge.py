from src.database.base_class import Base
from sqlalchemy import Column, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship

class Judge(Base):
    __tablename__ = 'judges'

    judge_id = Column(Integer, primary_key=True)
    status = Column(Boolean, default=True)
    user_id = Column(Integer, ForeignKey('users.user_id'))
    is_deleted = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="judge")
