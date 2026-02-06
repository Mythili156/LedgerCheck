# LedgerCheck - Backend API

This is the Python/FastAPI backend for LedgerCheck. It provides the core business logic, including:
*   File Processing (Pandas)
*   AI Analysis Integration (OpenAI)
*   PDF Report Generation
*   Database Management
*   Authentication (OAuth2/JWT)

## 🚀 Getting Started

### Prerequisites
*   Python 3.10+
*   Pip
*   A Database (PostgreSQL recommended, SQLite supported)

### Installation

1.  Navigate to the directory:
    ```bash
    cd backend
    ```

2.  Create a Virtual Environment:
    ```bash
    python -m venv venv
    
    # Activate:
    # Windows:
    venv\Scripts\activate
    # Mac/Linux:
    source venv/bin/activate
    ```

3.  Install Dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Configure Environment:
    Create a `.env` file (see `.env.example` if available, or use the format below):
    ```env
    OPENAI_API_KEY=sk-...
    DATABASE_URL=sqlite:///./finhealth.db
    SECRET_KEY=your_secret_key_here
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    ```

### Run Server

Start the development server:
```bash
uvicorn main:app --reload
```
The API will be available at [http://localhost:8000](http://localhost:8000).

API Documentation (Swagger UI) is available at [http://localhost:8000/docs](http://localhost:8000/docs).

## 📂 Project Structure

*   `main.py` - Application entry point.
*   `routers/` - API endpoints (Upload, Auth, Reports).
*   `services/` - Business logic (Analyzer, Report Generator).
*   `models.py` - Database models (SQLAlchemy).
*   `schemas.py` - Pydantic data schemas.

## 🛠️ Key Libraries
*   **FastAPI:** Web Framework
*   **SQLAlchemy:** ORM
*   **Pandas:** Data Analysis
*   **ReportLab:** PDF Generation
*   **OpenAI:** AI Integration
