from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import schemas
import auth
import crud
from exceptions import BadRequestException, NotFoundException, UnauthorizedException, ForbiddenException
import enums
from models import *
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate

router = APIRouter(
    prefix="/industry-requests",
    tags=["industry-requests"],
)



@router.get("/", response_model=Page[schemas.IndustryRequest])
def read_industry_requests(
    industry_id: Optional[str] = Query(default=None),
    db: Session = Depends(auth.get_db),
    current_user=Depends(auth.get_current_active_user),
):
    if not current_user:
        raise UnauthorizedException(detail="Authentication required")

    if hasattr(current_user, "account") and current_user.account.role == enums.UserRole.INDUSTRY:
        query = db.query(IndustryRequest).filter(
            IndustryRequest.industry_id == current_user.id
        )
        return paginate(query)

    query = db.query(IndustryRequest)
    if industry_id:
        query = query.filter(IndustryRequest.industry_id == industry_id)
    
    return paginate(query)


@router.post("/", response_model=schemas.IndustryRequest)
def create_industry_request(
    request: schemas.IndustryRequestBase,
    db: Session = Depends(auth.get_db),
    current_user=Depends(auth.get_current_active_industry),
):
    if not current_user:
        raise UnauthorizedException(detail="Authentication required")
    try:
        data = request.model_dump()
        return crud.create_industry_request(
            db=db,
            industry_id=current_user.id,
            **data
        )
    except Exception as e:
        raise BadRequestException(detail=str(e))


@router.get("/{request_id}", response_model=schemas.IndustryRequest)
def read_industry_request(
    request_id: str,
    db: Session = Depends(auth.get_db),
    current_user=Depends(auth.get_current_active_user),
):
    if not current_user:
        raise UnauthorizedException(detail="Authentication required")
    db_request = crud.get_industry_request(db, request_id=request_id)
    if not db_request:
        raise NotFoundException(detail="Industry request not found")
    return db_request


@router.patch("/{request_id}", response_model=schemas.IndustryRequest)
def update_industry_request(
    request_id: str,
    request_update: schemas.IndustryRequestUpdate,
    db: Session = Depends(auth.get_db),
    current_user=Depends(auth.get_current_active_user),
):
    if not current_user:
        raise UnauthorizedException(detail="Authentication required")
    db_request = crud.get_industry_request(db, request_id=request_id)
    if not db_request:
        raise NotFoundException(detail="Industry request not found")

    # Ownership check: industry can only update their own, admins can update any
    is_admin = current_user.account.role == enums.UserRole.ADMIN
    is_owner = (
        current_user.account.role == enums.UserRole.INDUSTRY
        and db_request.industry_id == current_user.id
    )
    if not is_admin and not is_owner:
        raise ForbiddenException(
            detail="You do not have permission to update this request")

    try:
        update_data = request_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_request, key, value)
        db.commit()
        db.refresh(db_request)
        return db_request
    except Exception as e:
        raise BadRequestException(detail=str(e))
