from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from src.api.deps import get_db
from src.schemas.sports_venues import SportsVenueCreate, SportsVenueUpdate, SportsVenueOut  
from src.crud.sports_venues import sports_venues_crud

router = APIRouter()

@router.get("/", response_model=list[SportsVenueOut])
def get_all_sports_venues(db: Session = Depends(get_db)):
    return sports_venues_crud.get_all(db)

@router.get("/{venue_id}", response_model=SportsVenueOut)
def get_sports_venue(venue_id: int, db: Session = Depends(get_db)):
    venue = sports_venues_crud.get(db, venue_id)
    if not venue:
        raise HTTPException(status_code=404, detail="Sports venue not found")
    return venue

@router.post("/", response_model=SportsVenueOut)
def create_sports_venue(venue: SportsVenueCreate, db: Session = Depends(get_db)):
    return sports_venues_crud.create(db, venue)

@router.put("/{venue_id}", response_model=SportsVenueOut)
def update_sports_venue(venue_id: int, venue: SportsVenueUpdate, db: Session = Depends(get_db)):
    existing_venue = sports_venues_crud.get(db, venue_id)
    if not existing_venue:
        raise HTTPException(status_code=404, detail="Sports venue not found")
    return sports_venues_crud.update(db, venue_id, venue)

@router.delete("/{venue_id}")
def delete_sports_venue(venue_id: int, db: Session = Depends(get_db)):
    existing_venue = sports_venues_crud.get(db, venue_id)
    if not existing_venue:
        raise HTTPException(status_code=404, detail="Sports venue not found")
    sports_venues_crud.delete(db, venue_id)
    return {"message": "Sports venue deleted successfully"}
