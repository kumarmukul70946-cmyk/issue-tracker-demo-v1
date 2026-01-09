import csv
import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.deps import get_db
from sqlalchemy import func

router = APIRouter()

@router.post("/", response_model=schemas.IssueOut)
def create_issue(issue: schemas.IssueCreate, db: Session = Depends(get_db)):
    db_issue = models.Issue(**issue.dict())
    db.add(db_issue)
    
    # Log History
    db.flush() # get ID
    history = models.IssueHistory(
        issue_id=db_issue.id,
        event_type="created",
        details="Issue created"
    )
    db.add(history)
    
    db.commit()
    db.refresh(db_issue)
    return db_issue

@router.get("/", response_model=List[schemas.IssueOut])
def get_issues(
    skip: int = 0, 
    limit: int = 10, 
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Issue)
    if status:
        query = query.filter(models.Issue.status == status)
    return query.order_by(models.Issue.created_at.desc()).offset(skip).limit(limit).all()

@router.get("/{id}", response_model=schemas.IssueOut)
def get_issue(id: int, db: Session = Depends(get_db)):
    issue = db.query(models.Issue).filter(models.Issue.id == id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return issue

@router.patch("/{id}", response_model=schemas.IssueOut)
def update_issue(id: int, payload: schemas.IssueUpdate, db: Session = Depends(get_db)):
    issue = db.get(models.Issue, id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    # Optimistic Locking Check
    if issue.version != payload.version:
        raise HTTPException(status_code=409, detail="Version conflict: The issue has been modified by someone else.")

    update_data = payload.dict(exclude_unset=True)
    update_data.pop("version", None) 
    
    changes = []
    old_status = issue.status
    
    for key, value in update_data.items():
        if getattr(issue, key) != value:
            changes.append(f"{key} changed from '{getattr(issue, key)}' to '{value}'")
            setattr(issue, key, value)
    
    if changes:
        issue.version += 1
        history = models.IssueHistory(
            issue_id=id,
            event_type="update",
            details=", ".join(changes)
        )
        db.add(history)
        
        # If status changed to closed, set resolved_at
        if "status" in update_data and update_data["status"] == "closed" and old_status != "closed":
            issue.resolved_at = datetime.utcnow()
    
    db.commit()
    db.refresh(issue)
    return issue

@router.put("/{id}/labels")
def update_issue_labels(id: int, label_ids: List[int], db: Session = Depends(get_db)):
    issue = db.get(models.Issue, id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    labels = db.query(models.Label).filter(models.Label.id.in_(label_ids)).all()
    
    issue.labels = labels # Auto handles correlation table update in simple cases or use explicit clear/extend
    
    history = models.IssueHistory(
        issue_id=id,
        event_type="labels_updated",
        details=f"Labels updated to: {', '.join([l.name for l in labels])}"
    )
    db.add(history)
    
    db.commit()
    return {"message": "Labels updated"}

@router.post("/{id}/comments", response_model=schemas.CommentOut)
def add_comment(id: int, comment: schemas.CommentCreate, db: Session = Depends(get_db)):
    issue = db.get(models.Issue, id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    if not comment.body.strip():
        raise HTTPException(status_code=400, detail="Comment body cannot be empty")

    new_comment = models.Comment(
        issue_id=id,
        author_id=comment.author_id,
        body=comment.body
    )
    db.add(new_comment)
    
    history = models.IssueHistory(
        issue_id=id,
        event_type="comment",
        details="Comment added"
    )
    db.add(history)

    db.commit()
    db.refresh(new_comment)
    return new_comment

@router.post("/bulk-status")
def bulk_update_status(payload: schemas.BulkStatusUpdate, db: Session = Depends(get_db)):
    try:
        issues = db.query(models.Issue).filter(models.Issue.id.in_(payload.issue_ids)).all()
        for issue in issues:
            if issue.status == "closed" and payload.status != "closed": 
                 # Example rule
                 pass
            
            if issue.status != payload.status:
                issue.status = payload.status
                db.add(models.IssueHistory(
                    issue_id=issue.id,
                    event_type="status_change",
                    details=f"Bulk status update to {payload.status}"
                ))
        
        db.commit()
        return {"updated": len(issues)}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/import")
async def import_issues(file: UploadFile = File(...), db: Session = Depends(get_db)):
    from app.services.csv_import import process_csv_import
    content = await file.read()
    return await process_csv_import(content, db) # Note: Import service doesn't log history currently to keep it simple

@router.get("/{id}/timeline")
def get_issue_timeline(id: int, db: Session = Depends(get_db)):
    history = db.query(models.IssueHistory).filter(models.IssueHistory.issue_id == id).order_by(models.IssueHistory.created_at.desc()).all()
    return history
