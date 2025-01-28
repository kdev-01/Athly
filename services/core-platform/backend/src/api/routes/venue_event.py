from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.schemas.venue_event import VenueEventCreate, VenueEventOut
from src.crud.venue_event import (
    get_venue_event,
    get_all_venue_events,
    create_venue_event,
    delete_venue_event
)
from src.api.deps import get_db

router = APIRouter()

@router.get("/", response_model=list[VenueEventOut])
def read_all_venue_events(db: Session = Depends(get_db)):
    return get_all_venue_events(db)

@router.get("/{id_event}/{id_venue}", response_model=VenueEventOut)
def read_venue_event(id_event: int, id_venue: int, db: Session = Depends(get_db)):
    venue_event = get_venue_event(db, id_event, id_venue)
    if not venue_event:
        raise HTTPException(status_code=404, detail="Venue event not found")
    return venue_event

@router.post("/", response_model=VenueEventOut)
def create_new_venue_event(venue_event: VenueEventCreate, db: Session = Depends(get_db)):
    return create_venue_event(db, venue_event)

@router.delete("/{id_event}/{id_venue}", response_model=VenueEventOut)
def delete_existing_venue_event(id_event: int, id_venue: int, db: Session = Depends(get_db)):
    deleted_venue_event = delete_venue_event(db, id_event, id_venue)
    if not deleted_venue_event:
        raise HTTPException(status_code=404, detail="Venue event not found")
    return deleted_venue_event
