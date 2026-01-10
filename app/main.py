from fastapi import FastAPI
from app.database import engine, Base
from app.routers import issues, comments, labels, reports

# Create tables (For simplicity in this project, we create them on startup if not using Alembic)
# In production with Alembic, you might not do this here.
# Create tables on startup
@app.on_event("startup")
async def startup_event():
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Error creating database tables: {e}")

app = FastAPI(title="Issue Tracker API", version="1.0.0")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(issues.router, prefix="/api/issues", tags=["Issues"])
# Comments are often nested under issues, handled in specific routers or separate
# The plan listed /issues/{id}/comments, so that can be in issues router or shared
# We'll see how we split it. Plan says: routers/comments.py
app.include_router(comments.router, prefix="/api/comments", tags=["Comments"]) 
app.include_router(labels.router, prefix="/api/labels", tags=["Labels"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])

@app.get("/api/health")
def root():
    return {"message": "Welcome to the Issue Tracker API", "status": "ok"}
