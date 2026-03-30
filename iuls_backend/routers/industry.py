from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import crud, models, schemas, auth
from exceptions import BadRequestException, NotFoundException, UnauthorizedException, ForbiddenException

router = APIRouter(
    prefix="/industry",
    tags=["industry"],
)

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