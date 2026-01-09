# Issue Tracker

A modern, full-stack Issue Tracking application featuring a responsive Dashboard, comprehensive Issue Management, and Data Visualizations.

![Dashboard Preview](https://placehold.co/1200x600/0f172a/ffffff?text=Issue+Tracker+Dashboard)
*(Note: Replace this image link with your actual screenshot from the `frontend` folder if you upload one)*

## 🚀 Features

### Frontend (React + Vite + TailwindCSS)
- **📊 Interactive Dashboard**: Real-time stats, recent issues, and top assignee leaderboards.
- **✨ Modern UI**: Clean aesthetics with glassmorphism, responsive styled components, and animations.
- **📝 Issue Management**: Create, view, filter (status/priority), and update issues.
- **📂 CSV Import**: Drag-and-drop bulk import for issues with validation summaries.
- **🏷️ Labels**: Manage and assign colored labels to issues.
- **📈 Analytics**: Charts for status distribution and priority analysis using `Recharts`.

### Backend (FastAPI + SQLAlchemy)
- **🔥 High Performance**: Built on FastAPI with async support.
- **💾 Database**: SQLite (default for dev) / PostgreSQL compatible.
- **🛡️ Data Integrity**: Optimistic locking for concurrent updates.
- **📝 History Tracking**: Audit logs for issue timeline (creation, status changes, comments).
- **⚡ Bulk Actions**: Transactional updates for multiple issues.
- **📊 Reporting APIs**: Endpoints for latency metrics and assignee performance.

---

## 🛠️ Setup & Running

### 1. Backend Setup
The backend serves the API at `http://localhost:8000`.

```bash
# Navigate to the root folder
cd "Issue Tracker API"

# Install Python dependencies
pip install -r requirements.txt

# Run the API server
python -m uvicorn app.main:app --reload
```
*Access Swagger Documentation at: [http://localhost:8000/docs](http://localhost:8000/docs)*

### 2. Frontend Setup
The frontend runs on `http://localhost:5173`.

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev
```

---

## 🧪 Architecture

### Folder Structure
```
├── app/                 # Backend Application
│   ├── routers/        # API Endpoints (issues, comments, reports)
│   ├── models.py       # Database Models (Issue, Comment, Label, History)
│   ├── schemas.py      # Pydantic Schemas
│   └── main.py         # Entry point
│
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # Reusable UI (Card, Layout, Modal)
│   │   ├── pages/      # Dashboard, IssueList, Reports
│   │   └── api/        # Axios client
│   └── tailwind.config.js
│
└── tests/              # Pytest Suite
```

## 🧪 Testing
Run backend tests to ensure logic correctness:
```bash
python -m pytest
```

## 📜 License
MIT
