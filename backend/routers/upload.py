from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from services.analyzer import process_financial_document, analyze_manual_data
from dependencies import get_current_user
from database import get_db
from models import User, FinancialRecord
import json
from security import encrypt_data

router = APIRouter(
    prefix="/upload",
    tags=["upload"]
)

class ManualEntry(BaseModel):
    revenue: float
    expenses: float
    profit: float

@router.post("/", summary="Upload Financial Document")
async def upload_file(
    file: UploadFile = File(...), 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload a financial document (CSV, XLSX, PDF) for analysis.
    Saves the result to the user's history.
    """
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    result = await process_financial_document(file)
    
    # Save to DB
    # Save to DB

    # Save to DB
    summary = result.get("financial_summary", {})
    
    # Encrypt the full analysis blob
    json_data = json.dumps(result)
    encrypted_blob = encrypt_data(json_data)

    record = FinancialRecord(
        user_id=current_user.id,
        filename=file.filename,
        revenue=summary.get("revenue", {}).get("total", 0),
        expenses=summary.get("expenses", {}).get("total", 0),
        profit=summary.get("net_profit", 0),
        analysis_data=encrypted_blob # Store ENCRYPTED data
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return result

@router.post("/manual", summary="Analyze Manual Data")
async def analyze_manual(
    data: ManualEntry,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyze manually entered financial data.
    Saves the result to the user's history.
    """
    result = analyze_manual_data(data.model_dump())
    
    # Save to DB
    summary = result.get("financial_summary", {})
    
    json_data = json.dumps(result)
    encrypted_blob = encrypt_data(json_data)

    record = FinancialRecord(
        user_id=current_user.id,
        filename="Manual Entry",
        revenue=summary.get("revenue", {}).get("total", 0),
        expenses=summary.get("expenses", {}).get("total", 0),
        profit=summary.get("net_profit", 0),
        analysis_data=encrypted_blob
    )
    db.add(record)
    db.commit()
    
    return result
