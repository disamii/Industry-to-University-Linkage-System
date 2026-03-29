from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import crud, models, schemas, auth

router = APIRouter(
    prefix="/industry",
    tags=["industry"],
)

@router.get("/", response_model=List[schemas.Industry])
def read_industries(skip: int = 0, limit: int = 100, db: Session = Depends(auth.get_db)):
    industries = crud.get_industries(db, skip=skip, limit=limit)
    return industries

@router.post("/", response_model=schemas.Industry)
def create_industry(industry: schemas.IndustryCreate, db: Session = Depends(auth.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    # Check if user has permission (e.g. OFFICE_ADMIN or COMPANY)
    # For now, let any authenticated user create
    return crud.create_industry(db=db, industry_name=industry.name, **industry.model_dump(exclude={"name"}))

@router.get("/{industry_id}", response_model=schemas.Industry)
def read_industry(industry_id: str, db: Session = Depends(auth.get_db)):
    db_industry = crud.get_industry(db, industry_id=industry_id)
    if db_industry is None:
        raise HTTPException(status_code=404, detail="Industry not found")
    return db_industry

# --- Industry Requests ---

@router.get("/{industry_id}/requests", response_model=List[schemas.IndustryRequest])
def read_industry_requests(industry_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(auth.get_db)):
    # This might need a custom CRUD filter by industry_id
    requests = db.query(models.IndustryRequest).filter(models.IndustryRequest.industry_id == industry_id).offset(skip).limit(limit).all()
    return requests

@router.post("/{industry_id}/requests", response_model=schemas.IndustryRequest)
def create_industry_request(industry_id: str, request: schemas.IndustryRequestCreate, db: Session = Depends(auth.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    if industry_id != request.industry_id:
        raise HTTPException(status_code=400, detail="Industry ID mismatch")
    return crud.create_industry_request(db=db, industry_id=industry_id, title=request.title, **request.model_dump(exclude={"industry_id", "title"}))
