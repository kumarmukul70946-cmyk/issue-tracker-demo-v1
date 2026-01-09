# Issue Tracker API

Complete backend solution for the Issue Tracker assignment.

## Tech Stack
- **FastAPI**
- **PostgreSQL** (Production) / **SQLite** (Testing default)
- **SQLAlchemy** (ORM)
- **Alembic** (Migrations - setup required)
- **Pytest** (Testing)

## Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Database Configuration**
   Update `app/database.py` with your PostgreSQL credentials. 
   Default: `postgresql://postgres:postgres@localhost/issue_tracker`

   *Note: For a quick start without PostgreSQL, you can change the URL in `database.py` to `sqlite:///./sql_app.db` and remove `check_same_thread` arg if not using SQLite (or add it if using SQLite).*

3. **Run the Application**
   ```bash
   python -m uvicorn app.main:app --reload
   ```
   
   Access API docs at: http://127.0.0.1:8000/docs

## Features Implemented
- **Issue CRUD**: Create, Read, Update (with Optimistic Locking).
- **Comments**: Add comments to issues.
- **Labels**: Atomic replacement of labels.
- **Bulk Update**: Transactional bulk status update.
- **Reports**: Top Assignees & Average Resolution Time.
- **Testing**: Basic Pytest coverage including optimistic locking check.

## Testing
Run tests with:
```bash
python -m pytest
```
