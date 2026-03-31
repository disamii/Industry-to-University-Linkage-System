from sqlalchemy.orm import Session
import models, schemas
import uuid
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: str, user_update: dict):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    for key, value in user_update.items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: str):
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False

def update_researcher_profile(db: Session, user_id: str, profile: schemas.UserProfileUpdate):
    update_data = profile.model_dump(exclude_unset=True)
    return update_user(db, user_id, update_data)

# --- Industry CRUD ---
def get_industry(db: Session, industry_id: str):
    return db.query(models.Industry).filter(models.Industry.id == industry_id).first()

def get_industries(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Industry).offset(skip).limit(limit).all()

def create_industry(db: Session, industry_name: str, **kwargs):
    db_industry = models.Industry(name=industry_name, **kwargs)
    db.add(db_industry)
    db.commit()
    db.refresh(db_industry)
    return db_industry

# --- Organizational Unit CRUD ---
def get_org_unit(db: Session, unit_id: str):
    return db.query(models.OrganizationalUnit).filter(models.OrganizationalUnit.id == unit_id).first()

def get_org_units(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.OrganizationalUnit).offset(skip).limit(limit).all()

def create_org_unit(db: Session, name: str, unit_type: str, **kwargs):
    db_unit = models.OrganizationalUnit(name=name, unit_type=unit_type, **kwargs)
    db.add(db_unit)
    db.commit()
    db.refresh(db_unit)
    return db_unit

# --- Industry Request CRUD ---
def get_industry_request(db: Session, request_id: str):
    return db.query(models.IndustryRequest).filter(models.IndustryRequest.id == request_id).first()

def get_industry_requests(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.IndustryRequest).offset(skip).limit(limit).all()

def create_industry_request(db: Session, industry_id: str, title: str, **kwargs):
    db_request = models.IndustryRequest(industry_id=industry_id, title=title, **kwargs)
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

# --- Post CRUD ---
def get_post(db: Session, post_id: str):
    return db.query(models.Post).filter(models.Post.id == post_id).first()

def get_posts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Post).offset(skip).limit(limit).all()

def create_post(db: Session, title: str, post_type_id: str, **kwargs):
    db_post = models.Post(title=title, post_type_id=post_type_id, **kwargs)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

# --- Assignment CRUD ---
def get_assignment(db: Session, assignment_id: str):
    return db.query(models.Assignment).filter(models.Assignment.id == assignment_id).first()

def get_assignments_by_request(db: Session, request_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.Assignment).filter(models.Assignment.request_id == request_id).offset(skip).limit(limit).all()

def create_assignment(db: Session, request_id: str, staff_id: str, department_id: str, **kwargs):
    db_assignment = models.Assignment(
        request_id=request_id,
        staff_id=staff_id,
        department_id=department_id,
        **kwargs
    )
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

def update_assignment_status(db: Session, assignment_id: str, update_data: dict):
    db_assignment = get_assignment(db, assignment_id)
    if not db_assignment:
        return None
    for key, value in update_data.items():
        setattr(db_assignment, key, value)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

# --- KPI CRUD ---
def get_kpi(db: Session, kpi_id: str):
    return db.query(models.KPI).filter(models.KPI.id == kpi_id).first()

def get_kpis_by_request(db: Session, request_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.KPI).filter(models.KPI.request_id == request_id).offset(skip).limit(limit).all()

def create_kpi(db: Session, request_id: str, **kwargs):
    db_kpi = models.KPI(request_id=request_id, **kwargs)
    db.add(db_kpi)
    db.commit()
    db.refresh(db_kpi)
    return db_kpi

def update_kpi(db: Session, kpi_id: str, update_data: dict):
    db_kpi = get_kpi(db, kpi_id)
    if not db_kpi:
        return None
    for key, value in update_data.items():
        setattr(db_kpi, key, value)
    db.commit()
    db.refresh(db_kpi)
    return db_kpi
