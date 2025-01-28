from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class WorkshopBase(BaseModel):
    name: str
    location: str
    date_time: datetime
    description: str | None
    event_id: int

class WorkshopCreate(WorkshopBase):
    pass

class WorkshopOut(WorkshopBase):
    workshop_id: int

class WorkshopUpdate(BaseModel):
    name: Optional[str]
    location: Optional[str]
    date_time: Optional[datetime]
    description: Optional[str]


    class Config:
        orm_mode = True

