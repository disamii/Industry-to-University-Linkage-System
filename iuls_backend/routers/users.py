from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from exceptions import BadRequestException, InternalServerErrorException, UnauthorizedException
from sqlalchemy.orm import Session
from datetime import timedelta
import crud
import models
import schemas
import auth
from config import settings
from rpms_service import get_user_from_rpms

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


# @router.post(
#     "/create-admin-industry",
#     response_model=schemas.User,
#     status_code=status.HTTP_201_CREATED,
# )
# async def create_admin_or_industry_user(
#     user: schemas.UserCreateWithRole,
#     db: Session = Depends(auth.get_db),
#     current_user: models.User = Depends(auth.require_admin)
# ):
#     """Admin-only endpoint to create admin or industry users"""
#     if user.role not in [models.UserRole.ADMIN, models.UserRole.INDUSTRY]:
#         raise BadRequestException(detail="Only admin and industry roles can be created manually")
    
#     existing_user = crud.get_user_by_email(db, email=user.email)
#     if existing_user:
#         raise BadRequestException(detail="Email is already registered")
    
#     created_user = crud.create_user(db=db, user=user)
#     if not created_user:
#         raise InternalServerErrorException(detail="Failed to create user")
#     return created_user


@router.get("/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
    if not current_user:
        raise UnauthorizedException()
    return current_user


@router.put("/me/profile", response_model=schemas.User)
async def update_my_profile(
    profile_update: schemas.UserProfileUpdate,
    db: Session = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if not current_user:
        raise UnauthorizedException()

    updated_user = crud.update_researcher_profile(
        db, current_user.id, profile_update)
    if not updated_user:
        raise BadRequestException(detail="Failed to update profile")

    return updated_user
