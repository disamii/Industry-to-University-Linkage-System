from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from errors import BadRequestException, InternalServerErrorException
from sqlalchemy.orm import Session
from datetime import timedelta
import crud, models, schemas, auth
from config import settings

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@router.post(
    "/register",
    response_model=schemas.User,
    status_code=status.HTTP_201_CREATED,
)
def register_user(
    user: schemas.UserCreate,
    db: Session = Depends(auth.get_db),
):
    existing_user = crud.get_user_by_email(db, email=user.email)
    if existing_user:
        raise BadRequestException(detail="Email is already registered")
    created_user = crud.create_user(db=db, user=user)
    if not created_user:
        raise InternalServerErrorException(detail="Failed to create user")
    return created_user


@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(db: Session = Depends(auth.get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not crud.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
    return current_user

@router.put("/me/profile", response_model=schemas.User)
async def update_my_profile(
    profile_update: schemas.UserProfileUpdate,
    db: Session = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    return crud.update_researcher_profile(db, current_user.id, profile_update)
