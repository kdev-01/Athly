from pydantic import BaseModel
from typing import Optional

class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

class Role(RoleBase):
    role_id: int

    class Config:
        from_attributes: True

class RoleCreate(RoleBase):
    pass
