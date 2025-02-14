from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.api.deps import get_db  # Importa la función para obtener la sesión de la base de datos
from src.schemas.students import Student as StudentSchema # Importa el esquema de Student para la validación de datos
from src.models import Student as StudentModel # Importa el modelo de Student de SQLAlchemy
from src.crud.students import get_students # Importa la función para obtener todos los estudiantes (si la usas)

router = APIRouter(
    prefix="/students",
    tags=["students"],
)

@router.get("/", response_model=List[StudentSchema])
def read_students(db: Session = Depends(get_db), representative_id: Optional[int] = None):
    if representative_id:
        students = db.query(StudentModel).filter(StudentModel.representative_id == representative_id).all()
    else:
        students = get_students(db) # Si usas una función CRUD separada
        # students = db.query(StudentModel).all() # Si quieres consultar directamente aquí
    return students
