from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.schemas.category import CategoryOut
from src.crud.category import get_categories
from src.api.deps import get_db

router = APIRouter()

@router.get("/", response_model=list[CategoryOut])
def read_categories(db: Session = Depends(get_db)):
    return get_categories(db)
