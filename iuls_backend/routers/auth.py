from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Optional
import crud
import models
import schemas
import auth
from config import settings
from rpms_service import get_user_from_rpms
from exceptions import BadRequestException, InternalServerErrorException, UnauthorizedException
from pydantic import BaseModel, EmailStr

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
    
    # Fetch account from local DB
    account = crud.get_account_by_email(db, email=email)
    
    if not account:
        raise UnauthorizedException(detail="Invalid credentials")
    
    # Verify password
    if account.role == models.UserRole.USER:
        if password != account.password:
            raise UnauthorizedException(detail="Invalid credentials")
    else:
        if not crud.verify_password(password, account.password):
            raise UnauthorizedException(detail="Invalid credentials")
    
    # Password verified - generate token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = auth.create_access_token(
        data={"sub": account.email}, expires_delta=access_token_expires
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
    """
    # 1. Check local Account table
    account = crud.get_account_by_email(db, email=request.email)
    
    if account:
        # Resolve the full name from the local profile
        name = None
        if account.role == models.UserRole.INDUSTRY:
            profile = db.query(models.Industry).filter(models.Industry.account_id == account.id).first()
            name = profile.name if profile else None
        elif account.role in (models.UserRole.USER, models.UserRole.ADMIN):
            profile = db.query(models.User).filter(models.User.account_id == account.id).first()
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
        # Strip out organizational structure fields before saving
        rpms_data = {k: v for k, v in rpms_user.items() if k not in (
            "id", "academic_unit", "academic_unit_id",
            "last_login", "is_active", "created_by", "updated_by",
            "created_at", "updated_at", "raw_password"
        )}
        
        # Save to local DB (password stored as-is since it's pre-hashed from RPMS)
        try:
            saved_user = crud.create_user_from_rpms(db=db, rpms_user_data=rpms_data)
        except Exception:
            pass  # If save fails, still return the RPMS result
        
        full_name = f"{rpms_user.get('first_name', '')} {rpms_user.get('father_name', '')} {rpms_user.get('grand_father_name', '')}".strip()
        return {
            "exists": True,
            "email": rpms_user.get("email", request.email),
            "name": full_name,
            "role": "user"
        }
    
    # 3. Not found anywhere
    return {"exists": False}
