from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    first_name: str = Field(..., min_length=3, max_length=50)
    last_name: str = Field(..., min_length=3, max_length=50)
    email: EmailStr = Field(...)
    phone: str = Field(..., min_length=10, max_length=14)
    photo_url: Optional[str] = None
    role_id: int = Field(..., gt=0)

class CreateUser(UserBase):
    password: str = Field(..., min_length=6, max_length=255)

class ReadUser(UserBase):
    user_id: int = Field(...)
    created_at: datetime = Field(...)
    updated_at: datetime = Field(...)

    class Config:
        from_attributes: True

class DashboardData(BaseModel):
    first_name: str = Field(...)
    last_name: str = Field(...)
    photo_url: Optional[str] = None
    
class UserLogin(BaseModel):
    email: EmailStr = Field(...)
    password: str = Field(..., min_length=6, max_length=255)

class UserEmail(BaseModel):
    email: EmailStr = Field(...)
