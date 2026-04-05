from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import crud,schemas, auth
from models import *
from exceptions import BadRequestException, NotFoundException, UnauthorizedException, ForbiddenException

router = APIRouter(
    prefix="/kpis",
    tags=["kpis"],
)

@router.get("/request/{request_id}", response_model=List[schemas.KPI])
def read_kpis(request_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(auth.get_db)):
    """
    Get all KPIs for a specific industry request
    """
    kpis = crud.get_kpis_by_request(db, request_id=request_id, skip=skip, limit=limit)
    return kpis or []

@router.post("/", response_model=schemas.KPI)
def create_kpi(
    kpi: schemas.KPICreate,
    db: Session = Depends(auth.get_db),
    current_user:  StaffProfile = Depends(auth.get_current_active_user)
):
    if not current_user:
        raise UnauthorizedException(detail="Authentication required")
        
    try:
        return crud.create_kpi(
            db=db,
            request_id=kpi.request_id,
            **kpi.model_dump(exclude={"request_id"})
        )
    except Exception as e:
        raise BadRequestException(detail=str(e))

@router.get("/{kpi_id}", response_model=schemas.KPI)
def read_kpi(kpi_id: str, db: Session = Depends(auth.get_db)):
    db_kpi = crud.get_kpi(db, kpi_id=kpi_id)
    if not db_kpi:
        raise NotFoundException(detail="KPI not found")
    return db_kpi

@router.patch("/{kpi_id}", response_model=schemas.KPI)
def update_kpi(
    kpi_id: str,
    kpi_update: schemas.KPIUpdate,
    db: Session = Depends(auth.get_db),
    current_user:  StaffProfile = Depends(auth.get_current_active_user)
):
    if not current_user:
        raise UnauthorizedException(detail="Authentication required")

    db_kpi = crud.get_kpi(db, kpi_id=kpi_id)
    if not db_kpi:
        raise NotFoundException(detail="KPI not found")
        
    try:
        updated = crud.update_kpi(
            db=db, 
            kpi_id=kpi_id, 
            update_data=kpi_update.model_dump(exclude_unset=True)
        )
        return updated
    except Exception as e:
        raise BadRequestException(detail=str(e))
