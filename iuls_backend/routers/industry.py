from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import crud
from models import Industry
import schemas
import crud
import auth
import db
from exceptions import BadRequestException, NotFoundException
# Correct
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
router = APIRouter(
    prefix="/industry",
    tags=["industry"],
)


@router.post("/register", response_model=schemas.Industry)
def register_industry(
    industry: schemas.IndustryCreate,
    db: Session = Depends(db.get_db)
):
    # Email uniqueness
    existing_industry = crud.get_industry_by_email(db, email=industry.email)
    if existing_industry:
        raise BadRequestException(
            detail="Industry with this email already exists")

    # Name uniqueness
    # existing_name = crud.get_industry_by_name(db, name=industry.name)
    # if existing_name:
    #     raise BadRequestException(detail="Industry with this name already exists")

    try:
        return crud.create_industry_with_auth(db=db, industry=industry)
    except Exception as e:
        raise BadRequestException(
            detail=f"Failed to create industry: {str(e)}")


@router.put("/me/profile", response_model=schemas.Industry)
def update_profile(
    profile_update: schemas.IndustryProfileUpdate,
    db: Session = Depends(db.get_db),
    current_industry:  Industry = Depends(auth.get_current_active_industry)
):
    """
    Update the authenticated industry's profile.
    """
    updated_industry = crud.update_industry_profile(
        db, current_industry.id, profile_update)
    if not updated_industry:
        raise NotFoundException(detail="Industry not found")
    return updated_industry


@router.get("/", response_model=Page[schemas.Industry])
def read_industries(db: Session = Depends(auth.get_db)):
    return paginate(db.query(Industry))


@router.get("/{industry_id}", response_model=schemas.Industry)
def read_industry(industry_id: str, db: Session = Depends(db.get_db)):
    db_industry = crud.get_industry(db, industry_id=industry_id)
    if not db_industry:
        raise NotFoundException(detail="Industry not found")
    return db_industry


@router.get("/{industry_id}/requests", response_model=List[schemas.IndustryRequest])
def read_industry_requests_by_industry(
    industry_id: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(db.get_db),
    current_user=Depends(auth.get_current_active_user)
):
    """
    Get all requests for a specific industry.
    """
    db_industry = crud.get_industry(db, industry_id=industry_id)
    if not db_industry:
        raise NotFoundException(detail="Industry not found")

    # Protection: Industry can only see their own requests unless admin
    is_admin = current_user.account.role == UserRole.ADMIN
    is_owner = (
        current_user.account.role == UserRole.INDUSTRY
        and industry_id == current_user.id
    )

    if not is_admin and not is_owner:
        from exceptions import ForbiddenException
        raise ForbiddenException(
            detail="You do not have permission to view these requests")

    return crud.get_industry_requests_by_industry(db, industry_id=industry_id, skip=skip, limit=limit)
