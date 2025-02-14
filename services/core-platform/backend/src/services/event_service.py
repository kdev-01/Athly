from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from src.crud.representative import RepresentativeCRUD
from src.crud.event import get_event_participants, get_events_by_institution, get_events_available
from src.crud.event_participants import get_all_event_participants

class EventServices:
    @staticmethod
    def get_events(
        user: dict,
        db: Session
    ):    
        email = user.get("email")
        user_institution_id = RepresentativeCRUD.get_representative(db, email)

        if user_institution_id is None:
            return []
        
        assignments = get_all_event_participants(db)
        events = get_events_available(db, user_institution_id)

        future_events = [
            event for event in events
            if (
                (
                    datetime.strptime(event["registration_end_date"], "%Y-%m-%d").date()
                    if isinstance(event["registration_end_date"], str)
                    else event["registration_end_date"]
                ) >= datetime.now().date()
            ) and any(
                assignment.id_educational_institution == user_institution_id and
                assignment.id_event == event["event_id"]
                for assignment in assignments
            )
        ]

        return future_events
    
    @staticmethod
    def get_future_events(
        db: Session
    ):
        events = get_event_participants(db)
    
        future_events = [
            event for event in events
            if (
                (
                    datetime.strptime(event["end_date"], "%Y-%m-%d").date()
                    if isinstance(event["end_date"], str)
                    else event["end_date"]
                ) >= datetime.now().date()
            )
        ]

        return future_events
    
    @staticmethod
    def get_students(user: dict, db: Session):
        email = user.get("email")
        user_institution_id = RepresentativeCRUD.get_representative(db, email)

        if user_institution_id is None:
            return []
        
        students = get_events_by_institution(db, user_institution_id)
        return students
    