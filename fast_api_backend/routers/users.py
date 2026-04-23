from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from exceptions import BadRequestException, InternalServerErrorException, UnauthorizedException
from sqlalchemy.orm import Session, selectinload, joinedload
from datetime import timedelta
from typing import List
import crud
import schemas
import auth
from models import *
from config import settings
from rpms_service import get_user_from_rpms
from fastapi_pagination import Page, add_pagination
from fastapi_pagination.ext.sqlalchemy import paginate

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@router.get("/me", response_model=schemas.User)
async def read_users_me(current_user: StaffProfile = Depends(auth.get_current_active_user)):
    if not current_user:
        raise UnauthorizedException()
    return current_user


@router.get("/", response_model=Page[schemas.User])  # Wrap schema in Page
async def read_all_users(
    db: Session = Depends(auth.get_db),
    current_user: StaffProfile = Depends(auth.require_admin)
):
    """Admin only — list all staff users (excludes admins)"""

    # 1. Define the base query (without .all(), .offset(), or .limit())
    query = db.query(StaffProfile).join(Account).filter(
        Account.role == UserRole.USER
    )

    # 2. Pass the query to the paginate helper
    return paginate(db, query)


@router.get("/{user_id}", response_model=schemas.User)
async def read_user(
    user_id: str,
    db: Session = Depends(auth.get_db),
    current_user: StaffProfile = Depends(auth.require_admin)
):
    """Admin only — get a specific user with their assignments and nested requests"""
    from exceptions import NotFoundException

    # Define the eager loading logic once to reuse it
    # This loads assignments, and for each assignment, it loads the request
    loading_options = [
        selectinload(StaffProfile.assignments)
        .joinedload(Assignment.request)
        .joinedload(IndustryRequest.industry)
    ]

    # Try by staff_profile.id first
    user = db.query(StaffProfile).options(*loading_options).filter(
        StaffProfile.id == user_id
    ).first()

    # Fallback: try by account_id
    if not user:
        user = db.query(StaffProfile).options(*loading_options).filter(
            StaffProfile.account_id == user_id
        ).first()

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
