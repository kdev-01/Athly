from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class TeamScheduleBase(BaseModel):
    encounter_date: datetime
    institution_id1: int
    institution_id2: int
    venue_id: int
    judge_id: int
    event_id: int

class TeamScheduleCreate(TeamScheduleBase):
    pass

class TeamScheduleUpdate(BaseModel):
    encounter_date: Optional[datetime] = None
    institution_id1: Optional[int] = None
    institution_id2: Optional[int] = None
    venue_id: Optional[int] = None
    judge_id: Optional[int] = None
    event_id: Optional[int] = None

class TeamScheduleResponse(TeamScheduleBase):
    team_schedule_id: int

    class Config:
        from_attributes = True
