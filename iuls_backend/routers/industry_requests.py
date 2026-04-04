from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import crud, models, schemas, auth
from exceptions import BadRequestException, NotFoundException, UnauthorizedException, ForbiddenException

router = APIRouter(
    prefix="/industry-requests",
    tags=["industry-requests"],
)


@router.get("/", response_model=List[schemas.IndustryRequest])
def read_industry_requests(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(auth.get_db),
    current_user=Depends(auth.get_current_active_user),
):
    if not current_user:
        raise UnauthorizedException(detail="Authentication required")
    # Admins/staff see all requests; industry accounts only see their own
    if hasattr(current_user, 'account') and current_user.account.role == models.UserRole.INDUSTRY:
        return db.query(models.IndustryRequest).filter(
            models.IndustryRequest.industry_id == current_user.id
        ).offset(skip).limit(limit).all()
    return crud.get_industry_requests(db, skip=skip, limit=limit)


@router.post("/", response_model=schemas.IndustryRequest)
def create_industry_request(
    request: schemas.IndustryRequestBase,
    db: Session = Depends(auth.get_db),
    current_user=Depends(auth.get_current_active_industry),
):
    if not current_user:
        raise UnauthorizedException(detail="Authentication required")
    try:
        return crud.create_industry_request(
            db=db,
            industry_id=current_user.id,
            title=request.title,
            **request.model_dump(exclude={"title"}),
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
    request_update: schemas.IndustryRequestBase,
    db: Session = Depends(auth.get_db),
    current_user=Depends(auth.get_current_active_user),
):
    if not current_user:
        raise UnauthorizedException(detail="Authentication required")
    db_request = crud.get_industry_request(db, request_id=request_id)
    if not db_request:
        raise NotFoundException(detail="Industry request not found")

    # Ownership check: industry can only update their own, admins can update any
    is_admin = current_user.account.role == models.UserRole.ADMIN
    is_owner = (
        current_user.account.role == models.UserRole.INDUSTRY
        and db_request.industry_id == current_user.id
    )
    if not is_admin and not is_owner:
        raise ForbiddenException(detail="You do not have permission to update this request")

    try:
        update_data = request_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_request, key, value)
        db.commit()
        db.refresh(db_request)
        return db_request
    except Exception as e:
        raise BadRequestException(detail=str(e))
