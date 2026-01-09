import csv
import io
from sqlalchemy.orm import Session
from app import models

async def process_csv_import(file_content: bytes, db: Session):
    decoded = file_content.decode("utf-8")
    csv_reader = csv.DictReader(io.StringIO(decoded))
    
    success_count = 0
    failed_rows = []
    
    for row in csv_reader:
        if not row.get("title"):
            failed_rows.append({"row": row, "error": "Missing title"})
            continue
        
        try:
            new_issue = models.Issue(
                title=row["title"],
                description=row.get("description"),
                status=row.get("status", "open"),
                assignee_id=int(row["assignee_id"]) if row.get("assignee_id") else None
            )
            db.add(new_issue)
            success_count += 1
        except Exception as e:
            failed_rows.append({"row": row, "error": str(e)})
            
    db.commit() # Commit transaction
    
    return {
        "created": success_count,
        "failed": len(failed_rows),
        "errors": failed_rows
    }
