from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Optional
import crud,auth,schemas,enums
from config import settings
from rpms_service import get_user_from_rpms, process_academic_unit
from exceptions import BadRequestException, InternalServerErrorException, NotFoundException, UnauthorizedException, ValidationException
from pydantic import BaseModel, EmailStr
from models import *
router = APIRouter(
    prefix="/auth",
    tags=["authentication"],
)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/login", response_model=schemas.Token)
async def login(
    request: LoginRequest,
    db: Session = Depends(auth.get_db)
):
    """
    Unified login for User, Admin, and Industry.
    """
    email = request.email
    password = request.password
    account = crud.get_account_by_email(db, email=email)
    if not account:
        raise NotFoundException(detail="Invalid credentials")

    if account.role == enums.UserRole.USER:
        if not crud.verify_django_password(password, account.password):
            raise ValidationException(detail="Invalid credentials")
    else:
        if not crud.verify_password(password, account.password):
            raise UnauthorizedException(detail="Invalid credentials")

    # Password verified - generate token
    access_token_expires = timedelta(
        minutes=settings.access_token_expire_minutes)
    access_token = auth.create_access_token(
        data={"sub": account.email, "role": account.role.value}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


class CheckEmailRequest(BaseModel):
    email: EmailStr


@router.post("/check-email")
async def check_email(
    request: CheckEmailRequest,
    db: Session = Depends(auth.get_db)
):
    """
    Check if an email is already registered.
    First checks local DB, then falls back to RPMS.
    # """
    account = crud.get_account_by_email(db, email=request.email)
    if account:
        name = None
        if account.role == enums.UserRole.INDUSTRY:
            profile = db.query(core_models.Industry).filter(
                core_models.Industry.account_id == account.id).first()
            name = profile.name if profile else None
        elif account.role in (core_models.UserRole.USER, core_models.UserRole.ADMIN):
            profile = db.query(core_models.StaffProfile).filter(core_models.StaffProfile.account_id == account.id).first()
            if profile:
                name = f"{profile.first_name} {profile.father_name}"
        return {
            "exists": True,
            "email": account.email,
            "name": name,
            "role": account.role.value
        }

    # 2. Not found locally — check RPMS
    rpms_user = await get_user_from_rpms(request.email)

    if rpms_user:
        rpms_data = {k: v for k, v in rpms_user.items() if k not in (
            "id", "academic_unit", "academic_unit_id",
            "last_login", "is_active", "created_by", "updated_by",
            "created_at", "updated_at", "raw_password"
        )}
        academic_unit_id = None
        if "academic_unit" in rpms_user:
            academic_unit_id = process_academic_unit(
                db, rpms_user["academic_unit"])
            rpms_data["academic_unit_id"] = academic_unit_id
        try:
            print("trying to save ")
            saved_user = crud.create_user_from_rpms(
                db=db, rpms_user_data=rpms_data)

            full_name = f"{saved_user.first_name, saved_user.father_name, saved_user.grand_father_name, ''}".strip()
            return {
                "exists": False,
                "email": rpms_user.get("email", request.email),
                "name": full_name,
                "role": "user"
            }
        except Exception as e:
            print(e)
            return {e}
    return {"exists": False}
