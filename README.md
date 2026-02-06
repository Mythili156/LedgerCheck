# LedgerCheck - AI Financial Health Assistant

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Production%20Ready-green.svg)
![Tech](https://img.shields.io/badge/tech-React%20%7C%20FastAPI%20%7C%20OpenAI-indigo.svg)

**LedgerCheck** is an intelligent financial analysis tool designed for Small and Medium Enterprises (SMEs). It allows business owners to upload their financial documents (PDF, CSV, Excel) and instantly receive AI-powered insights, health scores, and actionable growth recommendations in multiple languages (English, Hindi, Tamil).

![Dashboard Preview](frontend/public/dashboard-preview.png)
*(Note: Add a screenshot to frontend/public/dashboard-preview.png later)*

## 🚀 Key Features

*   **📊 Instant Analysis:** Upload P&L statements or Balance sheets for instant visualization.
*   **🤖 Hybrid AI Engine:** Powered by GPT-5 for deep insights, with a robust rule-based fallback system for 100% uptime.
*   **🌍 Multilingual Support:** Full support for **English**, **Hindi** (हिंदी), and **Tamil** (தமிழ்).
*   **📉 Smart Forecasting:** Uses exponential smoothing to predict future revenue trends.
*   **🛡️ Tax Compliance:** Estimates GST liability and provides compliance calendars.
*   **🔒 Secure:** Bank-grade encryption for stored financial data.

## 🛠️ Tech Stack

*   **Frontend:** React 19, Vite, TailwindCSS, Recharts, Framer Motion
*   **Backend:** Python 3.11, FastAPI, Pandas, SQLAlchemy
*   **AI:** OpenAI API (GPT-5/GPT-4o) + Custom Rule Engine
*   **Database:** PostgreSQL (Production) / SQLite (Local)

## ⚡ Quick Start (Local Development)

### Prerequisites
*   Node.js (v18+)
*   Python (v3.10+)

### 1. Clone the Repository
```bash
git clone https://github.com/Mythili156/LedgerCheck.git
cd LedgerCheck
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

**Configure Environment:**
Create a `.env` file in the `backend/` folder:
```env
OPENAI_API_KEY=sk-your-key-here
DATABASE_URL=sqlite:///./finhealth.db
SECRET_KEY=your-secret-key
```

**Run Server:**
```bash
uvicorn main:app --reload
# Running at http://localhost:8000
```

### 3. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
# Running at http://localhost:5173
```

## 📦 Deployment

### Database (PostgreSQL)
We recommend using **Neon.tech** or **Supabase**. Get your connection string and update `DATABASE_URL` in your deployment environment.

### Backend (Render/Railway)
1.  Connect this repo to Render.
2.  Root Directory: `backend`
3.  Build Command: `pip install -r requirements.txt`
4.  Start Command: `uvicorn main:app --host 0.0.0.0 --port 10000`

### Frontend (Vercel/Netlify)
1.  Connect this repo to Vercel.
2.  Root Directory: `frontend`
3.  Environment Variables: `VITE_API_URL` = `https://your-backend-url.onrender.com` (No trailing slash).

## 📄 License
This project is licensed under the MIT License.
