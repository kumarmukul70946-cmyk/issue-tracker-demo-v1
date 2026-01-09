from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app import models
from app.deps import get_db

router = APIRouter()

@router.get("/top-assignees")
def get_top_assignees(db: Session = Depends(get_db)):
    # SELECT assignee_id, COUNT(*) FROM issues GROUP BY assignee_id ORDER BY COUNT DESC
    results = db.query(
        models.Issue.assignee_id, 
        func.count(models.Issue.id).label("count")
    ).group_by(models.Issue.assignee_id).order_by(desc("count")).all()
    
    return [{"assignee_id": r.assignee_id, "count": r.count} for r in results]

@router.get("/latency")
def get_average_resolution_time(db: Session = Depends(get_db)):
    # AVG(resolved_at - created_at)
    # We filter for resolved issues only (where resolved_at is not null)
    avg_diff = db.query(
        func.avg(models.Issue.resolved_at - models.Issue.created_at)
    ).filter(models.Issue.resolved_at.isnot(None)).scalar()
    
    return {"average_resolution_time": str(avg_diff) if avg_diff else None}
