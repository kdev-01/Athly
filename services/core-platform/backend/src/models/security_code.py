from src.database.base_class import Base
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

class SecurityCode(Base):
    __tablename__ = 'security_codes'

    code_id = Column(Integer, primary_key=True)
    code = Column(String(6), nullable=False)
    expiration = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)
    created_at = Column(DateTime, default=func.now())
    user_id = Column(Integer, ForeignKey('users.user_id'))

    user = relationship("User", back_populates="security_codes")
