import enum
from sqlalchemy import Column, String, Integer, DateTime, Numeric, Date, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class Industry(Base):
    __tablename__ = "industry"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    contact_person = Column(String)
    email = Column(String)
    phone = Column(String)
    industry_type = Column(String)
    efficiency_level = Column(String)
    address = Column(String)
    website = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    requests = relationship("IndustryRequest", back_populates="industry")

class IndustryLinkageOffice(Base):
    __tablename__ = "industry_linkage_office"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    email = Column(String)
    phone = Column(String)
    role = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    admins = relationship("User", back_populates="office")

class Department(Base):
    __tablename__ = "department"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    university_unit = Column(String)
    
    users = relationship("User", back_populates="department")
    assignments = relationship("Assignment", back_populates="department")

class Role(Base):
    __tablename__ = "role"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    description = Column(String)
    
    permissions = relationship("RolePermission", back_populates="role")
    users = relationship("StaffRole", back_populates="role")

class Permission(Base):
    __tablename__ = "permission"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    description = Column(String)
    
    roles = relationship("RolePermission", back_populates="permission")

class ISCEDBandCode(str, enum.Enum):
    GENERIC = "00"
    EDUCATION = "01"
    ARTS_HUMANITIES = "02"
    SOCIAL_SCIENCES = "03"
    BUSINESS_LAW = "04"
    NATURAL_SCIENCES = "05"
    ICT = "06"
    ENGINEERING = "07"
    AGRICULTURE = "08"
    HEALTH_WELFARE = "09"
    SERVICES = "10"
    FIELD_UNKNOWN = "99"

class User(Base):
    __tablename__ = "user"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    
    # Registration fields
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    # Fetched API Fields
    username = Column(String, unique=True, nullable=True)
    first_name = Column(String, nullable=True)
    father_name = Column(String, nullable=True)
    grand_father_name = Column(String, nullable=True)
    
    status = Column(String, default="PENDING")
    must_change_password = Column(Boolean, default=False)
    
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    
    # Existing relationships/domain fields
    department_id = Column(String, ForeignKey("department.id"), nullable=True)
    research_office_id = Column(String, nullable=True)
    office_admin_of_id = Column(String, ForeignKey("industry_linkage_office.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    department = relationship("Department", back_populates="users")
    office = relationship("IndustryLinkageOffice", back_populates="admins")
    assignments = relationship("Assignment", back_populates="staff")
    roles = relationship("StaffRole", back_populates="user")
    researcher_profile = relationship("ResearcherProfile", back_populates="user", uselist=False)

class ResearcherProfile(Base):
    __tablename__ = "researcher_profile"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("user.id", ondelete="CASCADE"), unique=True)
    
    biography = Column(Text, nullable=True)
    research_interests = Column(Text, nullable=True)
    phone_number = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)
    
    # You can also use Enum(ISCEDBandCode) in SQLAlchemy, but String is safer across DBs
    author_gender = Column(String, nullable=True)
    publication_isced_band = Column(String, nullable=True)
    
    author_category = Column(String, nullable=True)
    author_academic_rank = Column(String, nullable=True)
    author_qualification = Column(String, nullable=True)
    author_employment_type = Column(String, nullable=True)
    academic_title = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="researcher_profile")

class IndustryRequest(Base):
    __tablename__ = "industry_request"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    industry_id = Column(String, ForeignKey("industry.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    type = Column(String)
    status = Column(String)
    submitted_at = Column(DateTime(timezone=True))
    priority = Column(String)
    budget_required = Column(Numeric)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    industry = relationship("Industry", back_populates="requests")
    assignments = relationship("Assignment", back_populates="request")
    kpis = relationship("KPI", back_populates="request")

class Assignment(Base):
    __tablename__ = "assignment"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    request_id = Column(String, ForeignKey("industry_request.id"))
    staff_id = Column(String, ForeignKey("user.id"))
    department_id = Column(String, ForeignKey("department.id"))
    status = Column(String)
    progress = Column(String)
    assigned_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    
    request = relationship("IndustryRequest", back_populates="assignments")
    staff = relationship("User", back_populates="assignments")
    department = relationship("Department", back_populates="assignments")

class PostType(Base):
    __tablename__ = "post_type"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    
    posts = relationship("Post", back_populates="post_type")

class Post(Base):
    __tablename__ = "post"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    description = Column(Text)
    post_type_id = Column(String, ForeignKey("post_type.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    published_at = Column(DateTime(timezone=True))
    status = Column(String)
    
    post_type = relationship("PostType", back_populates="posts")
    images = relationship("PostImage", back_populates="post")
    project = relationship("Project", back_populates="post", uselist=False)
    research_call = relationship("ResearchCall", back_populates="post", uselist=False)
    job = relationship("Job", back_populates="post", uselist=False)
    success_story = relationship("SuccessStory", back_populates="post", uselist=False)

class PostImage(Base):
    __tablename__ = "post_image"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    post_id = Column(String, ForeignKey("post.id"))
    image_url = Column(String)
    description = Column(String, nullable=True)
    uploaded_at = Column(DateTime(timezone=True))
    
    post = relationship("Post", back_populates="images")

class Project(Base):
    __tablename__ = "project"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    post_id = Column(String, ForeignKey("post.id"))
    commercialization_status = Column(String)
    owner_name = Column(String, nullable=True)
    owner_email = Column(String, nullable=True)
    owner_link = Column(String, nullable=True)
    publication_link = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    post = relationship("Post", back_populates="project")

class ResearchCall(Base):
    __tablename__ = "research_call"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    post_id = Column(String, ForeignKey("post.id"))
    deadline = Column(Date)
    
    post = relationship("Post", back_populates="research_call")

class Job(Base):
    __tablename__ = "job"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    post_id = Column(String, ForeignKey("post.id"))
    employment_type = Column(String)
    location = Column(String)
    salary_min = Column(Numeric)
    salary_max = Column(Numeric)
    application_deadline = Column(Date)
    
    post = relationship("Post", back_populates="job")

class SuccessStory(Base):
    __tablename__ = "success_story"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    post_id = Column(String, ForeignKey("post.id"))
    impact_area = Column(String)
    measurable_outcome = Column(String)
    
    post = relationship("Post", back_populates="success_story")

class Notification(Base):
    __tablename__ = "notification"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    message = Column(String)
    target_user_id = Column(String, ForeignKey("user.id"))
    read_status = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class KPI(Base):
    __tablename__ = "kpi"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    request_id = Column(String, ForeignKey("industry_request.id"))
    response_time = Column(Integer)
    completion_status = Column(String)
    staff_performance = Column(String)
    office_performance = Column(String)
    
    request = relationship("IndustryRequest", back_populates="kpis")

class RolePermission(Base):
    __tablename__ = "role_permission"
    
    role_id = Column(String, ForeignKey("role.id"), primary_key=True)
    permission_id = Column(String, ForeignKey("permission.id"), primary_key=True)
    
    role = relationship("Role", back_populates="permissions")
    permission = relationship("Permission", back_populates="roles")

class StaffRole(Base):
    __tablename__ = "staff_role"
    
    staff_id = Column(String, ForeignKey("user.id"), primary_key=True)
    role_id = Column(String, ForeignKey("role.id"), primary_key=True)
    
    user = relationship("User", back_populates="roles")
    role = relationship("Role", back_populates="users")
