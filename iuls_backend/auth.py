from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from db import SessionLocal
import schemas, crud
from models.account_models import *
from models.core_models import *
from config import settings
from exceptions import ForbiddenException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.refresh_token_expire_days)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    account = crud.get_account_by_email(db, email=email)
    if account is None:
        raise credentials_exception
        
    # Return appropriate profile based on role mapping
    if account.role ==  UserRole.INDUSTRY:
        return account.industry_profile
    return account.user_profile

async def get_current_active_user(current_user = Depends(get_current_user)):
    return current_user

async def get_current_industry(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    account = crud.get_account_by_email(db, email=email)
    if account is None or account.role !=  UserRole.INDUSTRY:
        raise credentials_exception
    return account.industry_profile


async def get_current_active_industry(current_industry:  Industry = Depends(get_current_industry)):
    return current_industry


def require_role(required_role:  UserRole):
    """
    Dependency factory that creates a dependency to require a specific user role.
    
    Args:
        required_role: The role required to access the resource
        
    Returns:
        Dependency function that checks the user's role
    """
    async def role_dependency(current_user:  StaffProfile = Depends(get_current_active_user)):
        if current_user.role != required_role:
            raise ForbiddenException(detail=f"Access denied. Required role: {required_role.value}")
        return current_user
    return role_dependency


def require_admin(current_user:  StaffProfile = Depends(get_current_active_user)):
    """Dependency that requires admin role"""
    if current_user.role !=  UserRole.ADMIN:
        raise ForbiddenException(detail="Access denied. Admin role required")
    return current_user


def require_industry(current_user:  StaffProfile = Depends(get_current_active_user)):
    """Dependency that requires industry role"""
    if current_user.role !=  UserRole.INDUSTRY:
        raise ForbiddenException(detail="Access denied. Industry role required")
    return current_user


def require_user_or_admin(current_user:  StaffProfile = Depends(get_current_active_user)):
    """Dependency that requires user or admin role"""
    if current_user.role not in [ UserRole.USER,  UserRole.ADMIN]:
        raise ForbiddenException(detail="Access denied. User or Admin role required")
    return current_user


def require_any_role(*allowed_roles:  UserRole):
    """
    Dependency factory that allows any of the specified roles.
    
    Args:
        *allowed_roles: Variable number of allowed roles
        
    Returns:
        Dependency function that checks if user has any of the allowed roles
    """
    async def role_dependency(current_user:  StaffProfile= Depends(get_current_active_user)):
        if current_user.role not in allowed_roles:
            role_names = [role.value for role in allowed_roles]
            raise ForbiddenException(detail=f"Access denied. Required one of: {', '.join(role_names)}")
        return current_user
    return role_dependency
