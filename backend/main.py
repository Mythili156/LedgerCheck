from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="Financial Health Assessment API",
    description="Backend for SME Financial Health Assessment Tool",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*", # Allow all origins for production (Netlify/Vercel)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Financial Health Assessment API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include Routers
# Include Routers
from routers import upload, auth, reports
from database import engine, Base

# Create Database Tables
Base.metadata.create_all(bind=engine)

app.include_router(upload.router)
app.include_router(auth.router)
app.include_router(reports.router)
