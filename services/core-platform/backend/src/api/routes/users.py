from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..deps import get_db
from src.crud import user as user_crud
from src.schemas import user as user_schema

router = APIRouter()

@router.get('/', response_model=List[user_schema.User])
def read_users(db: Session = Depends(get_db)):
    return user_crud.get_users(db)
