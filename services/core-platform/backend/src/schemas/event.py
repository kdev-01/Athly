from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import date


class EventBase(BaseModel):
    name: str
    start_date: date
    end_date: date
    registration_start_date: date
    registration_end_date: date
    sport_id: int
    category_id: int


class EventCreate(EventBase):
    # Validación de la fecha de fin
    @field_validator("end_date")
    def validate_end_date(cls, end_date, info):
        start_date = info.data.get("start_date")  # Accede al valor de start_date desde info.data
        if start_date and end_date <= start_date:
            raise ValueError("La fecha de fin no puede ser menor o igual a la fecha de inicio.")
        return end_date

    # Validación de la fecha de fin de inscripción
    @field_validator("registration_end_date")
    def validate_registration_dates(cls, registration_end_date, info):
        registration_start_date = info.data.get("registration_start_date")  # Accede al valor de registration_start_date
        if registration_start_date and registration_end_date <= registration_start_date:
            raise ValueError("La fecha de fin de inscripción no puede ser menor o igual a la fecha de inicio de inscripción.")
        return registration_end_date

class EventUpdate(BaseModel):
    name: Optional[str]
    start_date: Optional[date]
    end_date: Optional[date]
    registration_start_date: Optional[date]
    registration_end_date: Optional[date]
    sport_id: Optional[int]
    category_id: Optional[int]
    

class EventOut(EventBase):
    event_id: int

    class Config:
        orm_mode = True
