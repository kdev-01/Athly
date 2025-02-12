from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.api.deps import get_db
from src.schemas.judge import JudgeCreate, JudgeUpdate, JudgeResponse
from src.crud.judge import get_judge, get_all_judges, create_judge, update_judge, delete_judge

router = APIRouter()

@router.get("/all", response_model=list[JudgeResponse])
def read_all_judges(db: Session = Depends(get_db)):
    return get_all_judges(db)


@router.get("/{judge_id}", response_model=JudgeResponse)
def read_judge(judge_id: int, db: Session = Depends(get_db)):
    judge = get_judge(db, judge_id)
    if not judge:
        raise HTTPException(status_code=404, detail="Judge not found")
    return judge

@router.post("/", response_model=JudgeResponse)
def create_new_judge(judge_data: JudgeCreate, db: Session = Depends(get_db)):
    return create_judge(db, judge_data)

@router.put("/{judge_id}", response_model=JudgeResponse)
def update_existing_judge(judge_id: int, judge_data: JudgeUpdate, db: Session = Depends(get_db)):
    updated_judge = update_judge(db, judge_id, judge_data)
    if not updated_judge:
        raise HTTPException(status_code=404, detail="Judge not found")
    return updated_judge

@router.delete("/{judge_id}", response_model=JudgeResponse)
def delete_existing_judge(judge_id: int, db: Session = Depends(get_db)):
    deleted_judge = delete_judge(db, judge_id)
    if not deleted_judge:
        raise HTTPException(status_code=404, detail="Judge not found")
    return deleted_judge
