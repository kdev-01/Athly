from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
from src.schemas.event import EventCreate
from src.schemas.event import EventUpdate
from src.models.event import Event
from src.models.registered_student import RegisteredStudent
from src.models.student import Student
from src.models.representative import Representative
from src.utils.rules import MAX_SOCCER_PLAYERS, MIN_SOCCER_PLAYERS, MAX_BASKETBALL_PLAYERS, MIN_BASKETBALL_PLAYERS

def create_event(db: Session, event: EventCreate):
    
    new_event = Event(
        name=event.name,
        start_date=event.start_date,
        end_date=event.end_date,
        registration_start_date=event.registration_start_date,
        registration_end_date=event.registration_end_date,
        sport_id=event.sport_id,
        category_id=event.category_id,
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event


# Obtener todos los eventos
def get_events(db: Session):
    events = db.query(Event).options(
        joinedload(Event.sport),    # Cargar la relación con deporte
        joinedload(Event.category) # Cargar la relación con categoría
    ).all()

    # Transformar relaciones a dict para Pydantic
    result = []
    for event in events:
        result.append({
            "event_id": event.event_id,
            "name": event.name,
            "start_date": str(event.start_date),
            "end_date": str(event.end_date),
            "registration_start_date": str(event.registration_start_date),
            "registration_end_date": str(event.registration_end_date),
            "sport": {"id": event.sport.sport_id, "name": event.sport.name} if event.sport else None,
            "category": {"id": event.category.category_id, "name": event.category.name} if event.category else None,
        })

    return result


def get_event_by_id(db: Session, event_id: int):
    return db.query(Event).filter(Event.event_id == event_id).first()


# Eliminar eventos
def delete_event(db: Session, event_id: int):
    event = db.query(Event).filter(Event.event_id == event_id).first()
    if not event:
        return None
    db.delete(event)
    db.commit()
    return event

# Actualizar eventos
def update_event(db: Session, event_id: int, event_data: EventUpdate):
    event = db.query(Event).filter(Event.event_id == event_id).first()
    if not event:
        return None
    for key, value in event_data.dict(exclude_unset=True).items():
        setattr(event, key, value)
    db.commit()
    db.refresh(event)
    return event

def get_event_participants(db: Session):
    events = db.query(Event).options(
        joinedload(Event.sport),
        joinedload(Event.category),
        joinedload(Event.students).joinedload(RegisteredStudent.student).joinedload(Student.representative).joinedload(Representative.institution),
    ).all()

    result = []
    for event in events:
        institutions_dict = {}
        for registered_student in event.students:
            student = registered_student.student
            if not student or not student.representative or not student.representative.institution:
                continue

            institution = student.representative.institution
            institution_id = institution.institution_id

            if institution_id not in institutions_dict:
                institutions_dict[institution_id] = {
                    "id": institution_id,
                    "name": institution.name,
                    "students": []
                }

            institutions_dict[institution_id]["students"].append({
                "id": student.student_id,
                "identification": student.identification,
                "name": student.names,
                "surname": student.surnames,
                "date_birth": str(student.date_of_birth),
                "blood_type": student.blood_type,
                "photo": student.photo_url,
                "gender": student.gender_id,
                "status": registered_student.status
            })

        result.append({
            "event_id": event.event_id,
            "name": event.name,
            "start_date": str(event.start_date),
            "end_date": str(event.end_date),
            "registration_start_date": str(event.registration_start_date),
            "registration_end_date": str(event.registration_end_date),
            "sport": {"id": event.sport.sport_id, "name": event.sport.name} if event.sport else None,
            "category": {"id": event.category.category_id, "name": event.category.name} if event.category else None,
            "institutions": list(institutions_dict.values()),
        })

    return result

def get_events_by_institution(db: Session, institution_id: int):
    fecha_actual = func.current_date()

    events = db.query(Event).options(
        joinedload(Event.sport),
        joinedload(Event.category),
        joinedload(Event.students)
        .joinedload(RegisteredStudent.student)
        .joinedload(Student.representative)
        .joinedload(Representative.institution)
    ).filter(
        Representative.institution_id == institution_id,
        Event.start_date <= fecha_actual,
        Event.end_date >= fecha_actual
    ).all()

    result = []
    for event in events:
        institution_name = None
        students_list = []

        for reg_student in event.students:
            student = reg_student.student

            if not student or not student.representative or not student.representative.institution:
                continue

            if institution_name is None:
                institution_name = student.representative.institution.name
            
            if student.representative.institution_id == institution_id:
                students_list.append({
                    "id": student.student_id,
                    "identification": student.identification,
                    "name": student.names,
                    "surname": student.surnames,
                    "date_birth": str(student.date_of_birth),
                    "blood_type": student.blood_type,
                    "photo": student.photo_url,
                    "gender": student.gender_id,
                    "status": reg_student.status,
                    "description": reg_student.description
                })

        if students_list:
            result.append({
                "event_id": event.event_id,
                "name": event.name,
                "start_date": str(event.start_date),
                "end_date": str(event.end_date),
                "registration_start_date": str(event.registration_start_date),
                "registration_end_date": str(event.registration_end_date),
                "sport": {"id": event.sport.sport_id, "name": event.sport.name} if event.sport else None,
                "category": {"id": event.category.category_id, "name": event.category.name} if event.category else None,
                "institution_name": institution_name,
                "students": students_list
            })

    return result

def get_events_available(db: Session, institution_id: int):
    events = db.query(Event).options(
        joinedload(Event.sport),
        joinedload(Event.category),
        joinedload(Event.students)
    ).all()

    result = []
    for event in events:
        student_count = sum(
            1 for reg_student in event.students
            if reg_student.student.representative and reg_student.student.representative.institution_id == institution_id
        )

        sport_name = event.sport.name if event.sport else ""
        if sport_name == "Fútbol":
            max_players = MAX_SOCCER_PLAYERS
            min_players = MIN_SOCCER_PLAYERS
        elif sport_name == "Básquetbol":
            max_players = MAX_BASKETBALL_PLAYERS
            min_players = MIN_BASKETBALL_PLAYERS
        else:
            max_players = 1
            min_players = 1

        result.append({
            "event_id": event.event_id,
            "name": event.name,
            "start_date": str(event.start_date),
            "end_date": str(event.end_date),
            "registration_start_date": str(event.registration_start_date),
            "registration_end_date": str(event.registration_end_date),
            "sport": {"id": event.sport.sport_id, "name": event.sport.name} if event.sport else None,
            "category": {"id": event.category.category_id, "name": event.category.name} if event.category else None,
            "students_count": student_count,
            "max_players": max_players,
            "min_players": min_players
        })

    return result

def get_student_count_by_event(db: Session, institution_id: int, event_id: int):
    student_count = db.query(func.count(RegisteredStudent.student_id)).join(RegisteredStudent.student).join(Student.representative).filter(
        RegisteredStudent.id_event == event_id,
        Representative.institution_id == institution_id
    ).scalar()

    return student_count
