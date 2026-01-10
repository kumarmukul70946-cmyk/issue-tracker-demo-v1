from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base
from app.deps import get_db

# Use SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_create_issue():
    response = client.post(
        "/api/issues/",
        json={"title": "Test Issue", "description": "This is a test issue"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Issue"
    assert "id" in data

def test_read_issues():
    response = client.get("/api/issues/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_optimistic_locking():
    # Create issue
    res = client.post("/api/issues/", json={"title": "Locking Test"})
    issue_id = res.json()["id"]
    version = res.json()["version"]

    # Update 1
    res1 = client.patch(f"/api/issues/{issue_id}", json={"title": "Update 1", "version": version})
    assert res1.status_code == 200
    new_version = res1.json()["version"]

    # Update 2 with OLD version (should fail)
    res2 = client.patch(f"/api/issues/{issue_id}", json={"title": "Update 2", "version": version})
    assert res2.status_code == 409
