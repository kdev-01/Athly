from typing import Optional
from pydantic import BaseModel

class Representative(BaseModel):
    representative_id: int
    user_id: int
    institution_id: int
    is_deleted: bool

    class Config:
        orm_mode = True  