from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import crud
import models
import schemas
import auth
from exceptions import BadRequestException, NotFoundException, UnauthorizedException, ForbiddenException

router = APIRouter(
    prefix="/org-units",
    tags=["org-units"],
)


@router.get("/", response_model=List[schemas.OrgUnit])
def read_org_units(skip: int = 0, limit: int = 100, db: Session = Depends(auth.get_db)):
    units = crud.get_org_units(db, skip=skip, limit=limit)
    return units


@router.post("/", response_model=schemas.OrgUnit)
def create_org_unit(
    unit: schemas.OrgUnitCreate,
    db: Session = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if not current_user:
        raise UnauthorizedException(detail="Authentication required")

    # Example permission check
    # if current_user.role != "OFFICE_ADMIN":
    #     raise ForbiddenException(detail="You do not have permission to create organizational units")

    try:
        return crud.create_org_unit(
            db=db,
            name=unit.name,
            unit_type=unit.unit_type,
            **unit.model_dump(exclude={"name", "unit_type"})
        )
    except Exception as e:
        raise BadRequestException(detail=str(e))


@router.get("/{unit_id}", response_model=schemas.OrgUnit)
def read_org_unit(unit_id: str, db: Session = Depends(auth.get_db)):
    db_unit = crud.get_org_unit(db, unit_id=unit_id)
    if db_unit is None:
        raise NotFoundException(detail="Organizational Unit not found")
    return db_unit


@router.get("/{unit_id}/subunits", response_model=List[schemas.OrgUnit])
def read_subunits(unit_id: str, db: Session = Depends(auth.get_db)):
    db_unit = crud.get_org_unit(db, unit_id=unit_id)
    if db_unit is None:
        raise NotFoundException(detail="Organizational Unit not found")
    return db_unit.subnodes or []
