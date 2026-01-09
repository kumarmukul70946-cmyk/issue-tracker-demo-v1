from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.deps import get_db

router = APIRouter()

@router.post("/", response_model=schemas.LabelOut)
def create_label(label: schemas.LabelCreate, db: Session = Depends(get_db)):
    db_label = models.Label(name=label.name)
    db.add(db_label)
    db.commit()
    db.refresh(db_label)
    return db_label

@router.get("/", response_model=List[schemas.LabelOut])
def get_labels(db: Session = Depends(get_db)):
    return db.query(models.Label).all()
