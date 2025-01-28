from sqlalchemy.orm import Session
from src.models.venues_event import VenueEvent
from src.schemas.venue_event import VenueEventCreate

def get_venue_event(db: Session, id_event: int, id_venue: int):
    return db.query(VenueEvent).filter(
        VenueEvent.id_event == id_event,
        VenueEvent.id_venue == id_venue
    ).first()

def get_all_venue_events(db: Session):
    return db.query(VenueEvent).all()

def create_venue_event(db: Session, venue_event: VenueEventCreate):
    db_venue_event = VenueEvent(**venue_event.dict())
    db.add(db_venue_event)
    db.commit()
    db.refresh(db_venue_event)
    return db_venue_event

def delete_venue_event(db: Session, id_event: int, id_venue: int):
    db_venue_event = get_venue_event(db, id_event, id_venue)
    if db_venue_event:
        db.delete(db_venue_event)
        db.commit()
        return db_venue_event
    return None
