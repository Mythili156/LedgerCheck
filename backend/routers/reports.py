from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database import get_db
from models import User, FinancialRecord
from dependencies import get_current_user
from services.report_generator import generate_pdf_report
import json

router = APIRouter(
    prefix="/reports",
    tags=["reports"]
)

@router.get("/download", summary="Download Investor-Ready PDF Report")
async def download_report(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate and download a PDF report based on the user's latest financial upload.
    """
    # Get latest record
    record = db.query(FinancialRecord).filter(FinancialRecord.user_id == current_user.id).order_by(FinancialRecord.upload_date.desc()).first()
    
    if not record:
        raise HTTPException(status_code=404, detail="No financial data found. Please upload a file first.")
    
    # Parse stored JSON
    # Parse stored JSON (Decrypt first)
    try:
        from security import decrypt_data
        decrypted_json = decrypt_data(record.analysis_data)
        analysis_data = json.loads(decrypted_json)
    except Exception as e:
        print(f"Error decrypting report data: {e}")
        # Fallback if unencrypted (for old records) or error
        try:
             analysis_data = json.loads(record.analysis_data)
        except:
             analysis_data = {}

    pdf_buffer = generate_pdf_report(current_user.full_name, analysis_data)
    
    filename = f"FinHealth_Report_{current_user.id}.pdf"
    
    return StreamingResponse(
        pdf_buffer, 
        media_type="application/pdf", 
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/history", summary="Get Analysis History")
def get_analysis_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a list of all past financial analyses for history tracking.
    """
    records = db.query(FinancialRecord).filter(FinancialRecord.user_id == current_user.id).order_by(FinancialRecord.upload_date.desc()).all()
    
    history = []
    from security import decrypt_data
    
    for r in records:
        analysis = {}
        try:
            # Decrypt and parse analysis data if available
            if r.analysis_data:
                try:
                    decrypted = decrypt_data(r.analysis_data)
                    analysis = json.loads(decrypted)
                except:
                    # Fallback for unencrypted data
                    analysis = json.loads(r.analysis_data)
        except Exception as e:
            print(f"History parse error: {e}")
            analysis = {}

        history.append({
            "id": r.id,
            "date": r.upload_date.strftime("%Y-%m-%d"),
            "filename": r.filename,
            "revenue": r.revenue,
            "profit": r.profit,
            "type": "PDF/CSV",
            "recommendations": analysis.get("recommendations", []),
            "tax_compliance": analysis.get("tax_compliance", None)
        })
    
    return history
