from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
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

class EmailCheckRequest(BaseModel):
    email: EmailStr

class EmailCheckResponse(BaseModel):
    exists: bool
    email: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/check-email", response_model=EmailCheckResponse)
async def check_email(
    request: EmailCheckRequest,
    db: Session = Depends(auth.get_db)
):
    """
    Check if email exists in local database only.
    Does NOT call RPMS or any external service.
    """
    email = request.email
    
    # Check if user exists in local DB only
    user = crud.get_user_by_email(db, email=email)
    
    return {
        "exists": user is not None,
        "email": email
    }

@router.post("/login", response_model=schemas.Token)
async def login(
    request: LoginRequest,
    db: Session = Depends(auth.get_db)
):
    """
    Step 2: Verify password and generate token.
    User must exist in local DB at this point.
    """
    email = request.email
    password = request.password
    
    # Fetch user from local DB
    user = crud.get_user_by_email(db, email=email)
    
    if not user:
        # User doesn't exist in local DB
        raise UnauthorizedException(detail="Invalid credentials")
    
    # Verify password
    if not crud.verify_password(password, user.hashed_password):
        raise UnauthorizedException(detail="Invalid credentials")
    
    # Password verified - generate token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}
