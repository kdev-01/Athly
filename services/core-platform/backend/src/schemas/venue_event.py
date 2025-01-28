from pydantic import BaseModel

# Base Schema
class VenueEventBase(BaseModel):
    id_event: int
    id_venue: int

# Schema para creación
class VenueEventCreate(VenueEventBase):
    pass

# Schema para salida
class VenueEventOut(VenueEventBase):
    class Config:
        orm_mode = True
