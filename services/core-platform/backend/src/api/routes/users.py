from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from src.api.deps import get_db
from src.models.user import User
from src.schemas.user import UserBase, ReadUser

router = APIRouter()

@router.post('/', response_model=Dict[str, Any])
def create_user(user_schema: UserBase, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user_schema.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(**user_schema.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"detail": "User created successfully"}

@router.get('/', response_model=List[ReadUser])
def get_user(
    db: Session = Depends(get_db),
    id: Optional[int] = None,
    name: Optional[str] = None,
    email: Optional[str] = None):

    query = db.query(User)

    if id:
        query = query.filter(User.user_id == id)
    if name:
        query = query.filter(func.lower(User.first_name) == name.lower())
    if email:
        query = query.filter(User.email == email)

    return query.all()

@router.put('/', response_model=Dict[str, Any])
def update_user(id: int, user_schema: UserBase, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    for key, value in user_schema.model_dump().items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)

    return {"detail": "User updated successfully"}

@router.delete('/', response_model=Dict[str, Any])
def delete_user(id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"detail": "User deleted successfully"}
