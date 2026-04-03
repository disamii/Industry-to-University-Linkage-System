from pydantic import BaseModel,EmailStr
from typing import Optional
from datetime import datetime
from models import (
    ISCEDBandCode, AuthorCategoryCode, AcademicRankCode,
    QualificationCode, EmploymentTypeCode, AcademicTitle, UserRole
)

class UserBase(BaseModel):
    email: EmailStr  # <-- enforces valid email format
    role: Optional[UserRole] = UserRole.USER


class UserCreate(UserBase):
    password: str

class UserCreateWithRole(UserCreate):
    role: UserRole

class UserProfileUpdate(BaseModel):
    biography: Optional[str] = None
    research_interests: Optional[str] = None
    phone_number: Optional[str] = None
    profile_picture: Optional[str] = None
    author_gender: Optional[str] = None
    publication_isced_band: Optional[ISCEDBandCode] = None
    author_category: Optional[AuthorCategoryCode] = None
    author_academic_rank: Optional[AcademicRankCode] = None
    author_qualification: Optional[QualificationCode] = None
    author_employment_type: Optional[EmploymentTypeCode] = None
    academic_title: Optional[AcademicTitle] = None

class User(UserBase):
    id: str
    status: str
    role: UserRole
    
    # Other optional fields
    first_name: Optional[str] = None
    father_name: Optional[str] = None
    grand_father_name: Optional[str] = None
    biography: Optional[str] = None
    research_interests: Optional[str] = None
    phone_number: Optional[str] = None
    profile_picture: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Industry Schemas ---
class IndustryBase(BaseModel):
    name: str
    email: str
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    industry_type: Optional[str] = None
    efficiency_level: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None

class IndustryCreate(BaseModel):
    name: str
    email: str
    password: str

class IndustryProfileUpdate(BaseModel):
    name: Optional[str] = None
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    industry_type: Optional[str] = None
    efficiency_level: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None

class Industry(IndustryBase):
    id: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Organizational Unit Schemas ---
class OrgUnitBase(BaseModel):
    name: str
    abbreviation: Optional[str] = None
    unit_type: str
    description: Optional[str] = None
    parent_id: Optional[str] = None

class OrgUnitCreate(OrgUnitBase):
    pass

class OrgUnit(OrgUnitBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Industry Request Schemas ---
class IndustryRequestBase(BaseModel):
    title: str
    description: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = "PENDING"
    priority: Optional[str] = "MEDIUM"
    budget_required: Optional[float] = None

class IndustryRequestCreate(IndustryRequestBase):
    industry_id: str

class IndustryRequest(IndustryRequestBase):
    id: str
    industry_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Post and Content Schemas ---
class PostBase(BaseModel):
    title: str
    description: Optional[str] = None
    post_type_id: str
    status: Optional[str] = "DRAFT"

class PostCreate(PostBase):
    pass

class Post(PostBase):
    id: str
    created_at: datetime
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PostTypeBase(BaseModel):
    name: str

class PostType(PostTypeBase):
    id: str

    class Config:
        from_attributes = True

# --- Assignment Schemas ---
class AssignmentBase(BaseModel):
    status: Optional[str] = "PENDING"
    progress: Optional[str] = "0%"

class AssignmentCreate(AssignmentBase):
    request_id: str
    staff_id: str
    department_id: str

class AssignmentUpdate(BaseModel):
    status: Optional[str] = None
    progress: Optional[str] = None
    completed_at: Optional[datetime] = None

class Assignment(AssignmentBase):
    id: str
    request_id: str
    staff_id: str
    department_id: str
    assigned_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- KPI Schemas ---
class KPIBase(BaseModel):
    response_time: Optional[int] = None
    completion_status: Optional[str] = None
    staff_performance: Optional[str] = None
    office_performance: Optional[str] = None

class KPICreate(KPIBase):
    request_id: str

class KPIUpdate(BaseModel):
    response_time: Optional[int] = None
    completion_status: Optional[str] = None
    staff_performance: Optional[str] = None
    office_performance: Optional[str] = None

class KPI(KPIBase):
    id: str
    request_id: str

    class Config:
        from_attributes = True


class ErrorResponse(BaseModel):
    status_code: int
    detail: str
    extra: dict | None = None