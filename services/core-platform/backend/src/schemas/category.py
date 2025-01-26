from pydantic import BaseModel

class CategoryOut(BaseModel):
    category_id: int
    name: str

    class Config:
        orm_mode = True
