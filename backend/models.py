from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    financial_records = relationship("FinancialRecord", back_populates="owner")

class FinancialRecord(Base):
    __tablename__ = "financial_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    filename = Column(String)
    upload_date = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Store key metrics directly for easy querying
    revenue = Column(Float)
    expenses = Column(Float)
    profit = Column(Float)
    
    # Store full analysis result as a JSON string (for now) or text
    # In a real Postgres DB, use JSONB type
    analysis_data = Column(String) 

    owner = relationship("User", back_populates="financial_records")
