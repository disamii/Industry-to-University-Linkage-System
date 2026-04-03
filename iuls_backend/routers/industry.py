from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta
import crud
import models
import schemas
import auth
from config import settings
from exceptions import BadRequestException, NotFoundException, UnauthorizedException, ForbiddenException

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


@router.post("/login", response_model=schemas.Token)
def login_industry(
    industry_login: schemas.IndustryLogin,
    db: Session = Depends(auth.get_db)
):
    """
    Industry login endpoint.
    Authenticates industry and returns JWT token.
    """
    # Find industry by email
    industry = crud.get_industry_by_email(db, email=industry_login.email)
    if not industry:
        raise UnauthorizedException(detail="Invalid credentials")
    
    # Verify password
    if not crud.verify_industry_password(industry_login.password, industry.hashed_password):
        raise UnauthorizedException(detail="Invalid credentials")
    
    # Generate token with industry email
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = auth.create_access_token(
        data={"sub": industry.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/", response_model=List[schemas.Industry])
def read_industries(skip: int = 0, limit: int = 100, db: Session = Depends(auth.get_db)):
    industries = crud.get_industries(db, skip=skip, limit=limit)
    return industries


@router.post("/", response_model=schemas.Industry)
def create_industry(
    industry: schemas.IndustryCreate,
    db: Session = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if not current_user:
        raise UnauthorizedException(detail="Authentication required")

    # Example permission check
    # if current_user.role not in ["OFFICE_ADMIN", "COMPANY"]:
    #     raise ForbiddenException(detail="You do not have permission to create industries")

    try:
        return crud.create_industry(
            db=db,
            industry_name=industry.name,
            **industry.model_dump(exclude={"name"})
        )
    except Exception as e:
        raise BadRequestException(detail=str(e))


@router.get("/{industry_id}", response_model=schemas.Industry)
def read_industry(industry_id: str, db: Session = Depends(auth.get_db)):
    db_industry = crud.get_industry(db, industry_id=industry_id)
    if not db_industry:
        raise NotFoundException(detail="Industry not found")
    return db_industry

# --- Industry Requests ---


@router.get("/{industry_id}/requests", response_model=List[schemas.IndustryRequest])
def read_industry_requests(industry_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(auth.get_db)):
    requests = db.query(models.IndustryRequest).filter(
        models.IndustryRequest.industry_id == industry_id
    ).offset(skip).limit(limit).all()
    return requests or []


@router.post("/{industry_id}/requests", response_model=schemas.IndustryRequest)
def create_industry_request(
    industry_id: str,
    request: schemas.IndustryRequestCreate,
    db: Session = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if not current_user:
        raise UnauthorizedException(detail="Authentication required")

    if industry_id != request.industry_id:
        raise BadRequestException(detail="Industry ID mismatch")

    try:
        return crud.create_industry_request(
            db=db,
            industry_id=industry_id,
            title=request.title,
            **request.model_dump(exclude={"industry_id", "title"})
        )
    except Exception as e:
        raise BadRequestException(detail=str(e))
