from sqlalchemy.orm import Session
from src.models.sports_venue import SportsVenue
from src.schemas.sports_venues import SportsVenueCreate, SportsVenueUpdate

class SportsVenuesCRUD:
    def get_all(self, db: Session):
        return db.query(SportsVenue).all()

    def get(self, db: Session, venue_id: int):
        return db.query(SportsVenue).filter(SportsVenue.venue_id == venue_id).first()

    def create(self, db: Session, venue: SportsVenueCreate):
        new_venue = SportsVenue(**venue.dict())
        db.add(new_venue)
        db.commit()
        db.refresh(new_venue)
        return new_venue

    def update(self, db: Session, venue_id: int, venue: SportsVenueUpdate):
        existing_venue = self.get(db, venue_id)
        for key, value in venue.dict(exclude_unset=True).items():
            setattr(existing_venue, key, value)
        db.commit()
        db.refresh(existing_venue)
        return existing_venue

    def delete(self, db: Session, venue_id: int):
        existing_venue = self.get(db, venue_id)
        db.delete(existing_venue)
        db.commit()

sports_venues_crud = SportsVenuesCRUD()
