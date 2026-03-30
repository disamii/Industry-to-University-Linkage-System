from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from models import (
    ISCEDBandCode, AuthorCategoryCode, AcademicRankCode,
    QualificationCode, EmploymentTypeCode, AcademicTitle
)

class UserBase(BaseModel):
    email: str

class UserCreate(BaseModel):
    email: str
    password: str

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
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    industry_type: Optional[str] = None
    efficiency_level: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None

class IndustryCreate(IndustryBase):
    pass

class Industry(IndustryBase):
    id: str
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



class ErrorResponse(BaseModel):
    status_code: int
    detail: str
    extra: dict | None = None