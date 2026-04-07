from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from exceptions import BadRequestException, InternalServerErrorException, UnauthorizedException
from sqlalchemy.orm import Session
from datetime import timedelta
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
async def read_users_me(current_user:   StaffProfile = Depends(auth.get_current_active_user)):
    if not current_user:
        raise UnauthorizedException()
    return current_user


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
