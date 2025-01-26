from pydantic import BaseModel
from typing import Optional

class SportsVenueBase(BaseModel):
    name: str
    location: str
    image_url: Optional[str] = None
    status: Optional[bool] = False
    sport_id: int

class SportsVenueCreate(SportsVenueBase):
    pass

class SportsVenueUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[bool] = None
    sport_id: Optional[int] = None

class SportsVenueOut(SportsVenueBase):
    venue_id: int

    class Config:
        orm_mode = True
