from pydantic import BaseModel, Field, EmailStr
from typing_extensions import Annotated
from typing import Optional

class UserBase(BaseModel):
    first_name: Annotated[str, Field(min_length=3, max_length=50)]
    last_name: Annotated[str, Field(min_length=3, max_length=50)]
    email: EmailStr
    phone: Annotated[str, Field(min_length=10, max_length=14)]

    class Config:
        str_strip_whitespace = True

class UserCredentials(BaseModel):
    email: EmailStr
    password: Annotated[str, Field(min_length=6, max_length=255)]

class UserEmail(BaseModel):
    email: EmailStr

class GetUser(UserBase):
    user_id: Annotated[int, Field(ge=0)]
    role_name: Annotated[str, Field(min_length=3, max_length=50)]

class AddUser(BaseModel):
    email: EmailStr
    institution_name: Optional[Annotated[str, Field(min_length=3, max_length=100)]] = None
    role_name: Annotated[str, Field(min_length=3, max_length=50)]

class UserUpdate(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    