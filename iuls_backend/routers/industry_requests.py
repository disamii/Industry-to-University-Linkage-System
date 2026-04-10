
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination import Params

import schemas ,auth, crud,db
from exceptions import BadRequestException, NotFoundException, UnauthorizedException, ForbiddenException
import enums
from models import *

router = APIRouter(
    prefix="/industry-requests",
    tags=["industry-requests"],
)



@router.get("/", response_model=schemas.IndustryRequestPage[schemas.IndustryRequest])
def read_requests(db: Session = Depends(auth.get_db), params: Params = Depends()):
    query = db.query(IndustryRequest)

    stats_data = db.query(
        func.count(IndustryRequest.id).label("total"),
        func.sum(case((IndustryRequest.status == "PENDING", 1), else_=0)).label("pending"),
        func.sum(case((IndustryRequest.status == "COMPLETED", 1), else_=0)).label("completed"),
    ).first()

    # Step 1: normal pagination
    page = paginate(query, params)

    # Step 2: wrap into custom Page with extra fields
    return schemas.IndustryRequestPage.create(
        items=page.items,
        params=params,
        total=page.total,
        total_requests=stats_data.total or 0,
        pending_count=stats_data.pending or 0,
        completed_count=stats_data.completed or 0,
    )
@router.post("/", response_model=schemas.IndustryRequest)
def create_industry_request(
    request: schemas.IndustryRequestBase,
    db: Session = Depends(db.get_db),
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
    db: Session = Depends(db.get_db),
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
    db: Session = Depends(db.get_db),
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
