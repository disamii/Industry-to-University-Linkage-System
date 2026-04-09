from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from exceptions import BadRequestException, InternalServerErrorException, UnauthorizedException
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
import crud
from  models import *
import schemas
import auth
from config import settings
from rpms_service import get_user_from_rpms

router = APIRouter(
    prefix="/users",
    tags=["users"],
)



@router.get("/me", response_model=schemas.User)
async def read_users_me(current_user: StaffProfile = Depends(auth.get_current_active_user)):
    if not current_user:
        raise UnauthorizedException()
    return current_user


@router.get("/", response_model=List[schemas.User])
async def read_all_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(auth.get_db),
    current_user: StaffProfile = Depends(auth.require_admin)
):
    """Admin only — list all staff users (excludes admins)"""
    return db.query(StaffProfile).join(Account).filter(
        Account.role == UserRole.USER
    ).offset(skip).limit(limit).all()


@router.get("/{user_id}", response_model=schemas.User)
async def read_user(
    user_id: str,
    db: Session = Depends(auth.get_db),
    current_user: StaffProfile = Depends(auth.require_admin)
):
    """Admin only — get a specific user with their assignments"""
    from exceptions import NotFoundException
    # Try by staff_profile.id first
    user = db.query(StaffProfile).filter(StaffProfile.id == user_id).first()
    # Fallback: try by account_id
    if not user:
        user = db.query(StaffProfile).filter(StaffProfile.account_id == user_id).first()
    if not user:
        raise NotFoundException(detail="User not found")
    return user


@router.put("/me/profile", response_model=schemas.User)
async def update_my_profile(
    profile_update: schemas.UserProfileUpdate,
    db: Session = Depends(auth.get_db),
    current_user:   StaffProfile = Depends(auth.get_current_active_user)
):
    if not current_user:
        raise UnauthorizedException()

    updated_user = crud.update_researcher_profile(
        db, current_user.id, profile_update)
    if not updated_user:
        raise BadRequestException(detail="Failed to update profile")

    return updated_user
