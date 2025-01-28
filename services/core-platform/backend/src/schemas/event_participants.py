from pydantic import BaseModel

class EventParticipantBase(BaseModel):
    id_event: int
    id_educational_institution: int

class EventParticipantCreate(EventParticipantBase):
    pass

class EventParticipantUpdate(BaseModel):
    id_event: int | None = None
    id_educational_institution: int | None = None

class EventParticipant(EventParticipantBase):
    class Config:
        orm_mode = True
