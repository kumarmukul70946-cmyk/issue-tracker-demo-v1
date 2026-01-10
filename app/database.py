from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os

# Update this with your actual database URL
# For local dev: postgresql://user:password@localhost/dbname
# SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@localhost/issue_tracker"
# On Vercel, the filesystem is read-only except for /tmp
# We default to /tmp/sql_app.db for the demo if no DATABASE_URL is set
default_db = "sqlite:///./sql_app.db"
if os.environ.get("VERCEL"):
    default_db = "sqlite:////tmp/sql_app.db"

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", default_db)

connect_args = {}
if "sqlite" in SQLALCHEMY_DATABASE_URL:
    connect_args = {"check_same_thread": False}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
