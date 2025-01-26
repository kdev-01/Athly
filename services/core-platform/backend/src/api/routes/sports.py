from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.schemas.sport import SportOut
from src.crud.sport import get_sports
from src.api.deps import get_db

router = APIRouter()

@router.get("/", response_model=list[SportOut])
def read_sports(db: Session = Depends(get_db)):
    return get_sports(db)
