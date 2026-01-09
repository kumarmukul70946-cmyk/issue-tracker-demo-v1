from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.deps import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.CommentOut])
def get_comments(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(models.Comment).offset(skip).limit(limit).all()

# Additional comment management endpoints can go here (e.g. update/delete comment)
