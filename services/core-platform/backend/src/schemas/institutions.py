from pydantic import BaseModel
from typing import Optional

class InstitutionBase(BaseModel):
    name: str
    address: str

class InstitutionCreate(InstitutionBase):
    pass

class InstitutionUpdate(BaseModel):
    name: Optional[str]
    address: Optional[str]

class Institution(InstitutionBase):
    institution_id: int

    class Config:
        orm_mode = True
