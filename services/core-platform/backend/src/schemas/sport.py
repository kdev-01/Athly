from pydantic import BaseModel

class SportOut(BaseModel):
    sport_id: int
    name: str

    class Config:
        orm_mode = True
