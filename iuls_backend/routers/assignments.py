from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import crud,  schemas, auth
from exceptions import BadRequestException, NotFoundException, UnauthorizedException
from models.account_models import StaffProfile
from models import *
# Correct
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
router = APIRouter(
    prefix="/assignments",
    tags=["assignments"],
)

@router.get("/my", response_model=Page[schemas.Assignment])
def read_my_assignments(
    db: Session = Depends(auth.get_db),
    current_user: StaffProfile = Depends(auth.get_current_active_user)
):
    """
    Get all assignments for the currently authenticated staff member
    """
    if not current_user:
        raise UnauthorizedException(detail="Authentication required")
    
    query = db.query(Assignment).filter(Assignment.staff_id == current_user.id)
    return paginate(query)


@router.get("/", response_model=Page[schemas.Assignment])
def read_assignments(
    request_id: str,
    db: Session = Depends(auth.get_db)
):
    """
    Get all assignments for a specific industry request
    """
    query = crud.get_assignments_by_request(db, request_id=request_id)
    return paginate(query)

@router.post("/", response_model=schemas.Assignment)
def create_assignment(
    assignment: schemas.AssignmentCreate,
    db: Session = Depends(auth.get_db),
    current_user: StaffProfile = Depends(auth.get_current_active_user)
):
    if not current_user:
        raise UnauthorizedException(detail="Authentication required")
        
    try:
        return crud.create_assignment(
            db=db,
            request_id=assignment.request_id,
            staff_id=assignment.staff_id,
            department_id=assignment.department_id,
            **assignment.model_dump(exclude={"request_id", "staff_id", "department_id"})
        )
    except Exception as e:
        raise BadRequestException(detail=str(e))

@router.get("/{assignment_id}", response_model=schemas.Assignment)
def read_assignment(assignment_id: str, db: Session = Depends(auth.get_db)):
    db_assignment = crud.get_assignment(db, assignment_id=assignment_id)
    if not db_assignment:
        raise NotFoundException(detail="Assignment not found")
    return db_assignment

@router.patch("/{assignment_id}/progress", response_model=schemas.Assignment)
def update_assignment_progress(
    assignment_id: str,
    assignment_update: schemas.AssignmentUpdate,
    db: Session = Depends(auth.get_db),
    current_user: StaffProfile = Depends(auth.get_current_active_user)
):
    if not current_user:
        raise UnauthorizedException(detail="Authentication required")

    db_assignment = crud.get_assignment(db, assignment_id=assignment_id)
    if not db_assignment:
        raise NotFoundException(detail="Assignment not found")
        
    try:
        updated = crud.update_assignment_status(
            db=db, 
            assignment_id=assignment_id, 
            update_data=assignment_update.model_dump(exclude_unset=True)
        )
        return updated
    except Exception as e:
        raise BadRequestException(detail=str(e))
