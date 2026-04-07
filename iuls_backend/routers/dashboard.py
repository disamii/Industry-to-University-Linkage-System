from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import db
from models import *
import schemas

router = APIRouter(
    prefix="/analytics",
    tags=["analytics"],
)


@router.get("/overview", response_model=schemas.AnalyticsOverview)
def get_overview(db: Session = Depends(db.get_db)):
    return {
        "total_staff": db.query(StaffProfile).count(),
        "active_projects": db.query(Project).count(),
        "pending_requests": db.query(IndustryRequest).filter(IndustryRequest.status == "PENDING").count(),
        "total_industries": db.query(Industry).count(),
    }


@router.get("/request-trends")
def get_request_trends(db: Session = Depends(db.get_db)):
    status_counts = (
        db.query(IndustryRequest.status, func.count(IndustryRequest.id))
        .group_by(IndustryRequest.status)
        .all()
    )
    
    return {
        "labels": [s[0] for s in status_counts],
        "data": [s[1] for s in status_counts]
    }

