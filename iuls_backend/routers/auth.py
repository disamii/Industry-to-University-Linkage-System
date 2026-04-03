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
