from pydantic import BaseModel
from typing import Optional

class JudgeBase(BaseModel):
    status: bool = True
    user_id: int

class JudgeCreate(JudgeBase):
    pass

class JudgeUpdate(BaseModel):
    status: Optional[bool]
    is_deleted: Optional[bool]

class JudgeResponse(BaseModel):
    judge_id: int
    status: Optional[bool] = False  # Permite None y da un valor por defecto
    is_deleted: Optional[bool] = False  # Permite None y da un valor por defecto

    class Config:
        orm_mode = True
