from src.database.base_class import Base
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    phone = Column(String(15))
    photo_url = Column(Text)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    role_id = Column(Integer, ForeignKey('roles.role_id'), nullable=False)

    role = relationship("Role", back_populates="users")
    security_codes = relationship("SecurityCode", back_populates="user")
    workshops = relationship("WorkshopAttendance", back_populates="user")
    representative = relationship("Representative", back_populates="user", uselist=False)
    judge = relationship("Judge", uselist=False, back_populates="user")
