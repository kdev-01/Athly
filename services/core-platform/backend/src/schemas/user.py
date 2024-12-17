from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    photo_url: Optional[str] = None
    role_id: int

class User(UserBase):
    user_id: int

    class Config:
        from_attributes: True

class UserCreate(UserBase):
    pass
