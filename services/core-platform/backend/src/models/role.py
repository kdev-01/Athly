from src.database.base_class import Base
from sqlalchemy import Column, Integer, String

class Role(Base):
    __tablename__ = 'roles'

    role_id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
