from sqlalchemy.orm import Session
from src.models.event_participants import EventParticipant
from src.schemas.event_participants import EventParticipantCreate, EventParticipantUpdate

def get_all_event_participants(db: Session):
    return db.query(EventParticipant).all()

def get_event_participant_by_ids(db: Session, id_event: int, id_educational_institution: int):
    return db.query(EventParticipant).filter(
        EventParticipant.id_event == id_event,
        EventParticipant.id_educational_institution == id_educational_institution
    ).first()

def create_event_participant(db: Session, participant: EventParticipantCreate):
    db_participant = EventParticipant(**participant.dict())
    db.add(db_participant)
    db.commit()
    db.refresh(db_participant)
    return db_participant

def update_event_participant(
    db: Session, id_event: int, id_educational_institution: int, participant: EventParticipantUpdate
):
    db_participant = get_event_participant_by_ids(db, id_event, id_educational_institution)
    if not db_participant:
        return None
    for key, value in participant.dict(exclude_unset=True).items():
        setattr(db_participant, key, value)
    db.commit()
    db.refresh(db_participant)
    return db_participant

def delete_event_participant(db: Session, id_event: int, id_educational_institution: int):
    db_participant = get_event_participant_by_ids(db, id_event, id_educational_institution)
    if not db_participant:
        return None
    db.delete(db_participant)
    db.commit()
    return db_participant


def get_event_participants_by_event(db: Session, id_event: int):
    return db.query(EventParticipant).filter(EventParticipant.id_event == id_event).all()