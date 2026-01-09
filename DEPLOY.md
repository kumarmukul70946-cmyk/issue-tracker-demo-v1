## 🚀 Deployment Guide

This project is configured to be deployed as two separate services:
1. **Backend**: Python FastAPI (Deploys to Render/Railway)
2. **Frontend**: React Vite (Deploys to Vercel/Netlify)

---

### Step 1: Deploy Backend (Render.com)
1. Fork/Clone this repo to your GitHub.
2. Sign up at [Render.com](https://render.com).
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Configure:
   - **Root Directory**: `.` (leave empty)
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Click **Create Web Service**.
7. Once live, copy the **Service URL** (e.g., `https://issue-tracker-xyz.onrender.com`).

*Tip: For data persistence, add a PostgreSQL database in Render and set the `DATABASE_URL` environment variable in your Web Service settings.*

---

### Step 2: Deploy Frontend (Vercel)
1. Sign up at [Vercel.com](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Configure:
   - **Root Directory**: `frontend` (Click Edit)
   - **Framework Preset**: Vite
5. Add **Environment Variable**:
   - Name: `VITE_API_URL`
   - Value: `YOUR_BACKEND_URL` (The URL you copied from Render, e.g., `https://issue-tracker-xyz.onrender.com`)
   *Note: Remove any trailing slash from the URL.*
6. Click **Deploy**.

---

### 🎉 Done!
Your Issue Tracker is now live on the Vercel URL!
