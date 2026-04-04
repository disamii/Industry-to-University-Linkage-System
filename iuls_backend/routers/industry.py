from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import crud
from models import  core_models 
import schemas
import auth
from exceptions import BadRequestException, NotFoundException

router = APIRouter(
    prefix="/industry",
    tags=["industry"],
)


@router.post("/register", response_model=schemas.Industry)
def register_industry(
    industry: schemas.IndustryCreate,
    db: Session = Depends(auth.get_db)
):
    """
    Industry registration endpoint.
    Creates a new industry account with authentication.
    """
    # Check if industry with this email already exists
    existing_industry = crud.get_industry_by_email(db, email=industry.email)
    if existing_industry:
        raise BadRequestException(detail="Industry with this email already exists")
    
    try:
        return crud.create_industry_with_auth(db=db, industry=industry)
    except Exception as e:
        raise BadRequestException(detail=f"Failed to create industry: {str(e)}")


@router.put("/me/profile", response_model=schemas.Industry)
def update_profile(
    profile_update: schemas.IndustryProfileUpdate,
    db: Session = Depends(auth.get_db),
    current_industry: core_models.Industry = Depends(auth.get_current_active_industry)
):
    """
    Update the authenticated industry's profile.
    """
    updated_industry = crud.update_industry_profile(db, current_industry.id, profile_update)
    if not updated_industry:
        raise NotFoundException(detail="Industry not found")
    return updated_industry




@router.get("/", response_model=List[schemas.Industry])
def read_industries(skip: int = 0, limit: int = 100, db: Session = Depends(auth.get_db)):
    industries = crud.get_industries(db, skip=skip, limit=limit)
    return industries


@router.get("/{industry_id}", response_model=schemas.Industry)
def read_industry(industry_id: str, db: Session = Depends(auth.get_db)):
    db_industry = crud.get_industry(db, industry_id=industry_id)
    if not db_industry:
        raise NotFoundException(detail="Industry not found")
    return db_industry


