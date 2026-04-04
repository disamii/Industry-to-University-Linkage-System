from enums import AcademicRankCode, AcademicTitle, AuthorCategoryCode, EmploymentTypeCode, ISCEDBandCode, QualificationCode
from sqlalchemy import Column, String, Integer, DateTime, Numeric, Date, ForeignKey, Text, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql import func
from db import Base
import uuid
from enum import Enum as PyEnum


class UserRole(PyEnum):
    USER = "user"
    ADMIN = "admin"
    INDUSTRY = "industry"


def generate_uuid():
    return str(uuid.uuid4())


class Account(Base):
    __tablename__ = "account"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user_profile = relationship(
        "StaffProfile", back_populates="account", uselist=False)
    industry_profile = relationship(
        "Industry", back_populates="account", uselist=False)


class StaffProfile(Base):
    __tablename__ = "staff_profile"

    id = Column(String, primary_key=True, default=generate_uuid)
    account_id = Column(String, ForeignKey("account.id"),
                        unique=True, nullable=False)


    username = Column(String, unique=True, nullable=True)
    first_name = Column(String, nullable=True)
    father_name = Column(String, nullable=True)
    grand_father_name = Column(String, nullable=True)

    status = Column(String, default="PENDING",nullable=False)
    must_change_password = Column(Boolean, default=False)

    biography = Column(Text, nullable=True)
    research_interests = Column(Text, nullable=True)
    phone_number = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)

    author_gender = Column(String, nullable=True)
    publication_isced_band = Column(SQLEnum(ISCEDBandCode), nullable=True)
    academic_unit_id = Column(String, ForeignKey("organizational_unit.id"), nullable=False)

    author_category = Column(SQLEnum(AuthorCategoryCode), nullable=True)
    author_academic_rank = Column(SQLEnum(AcademicRankCode), nullable=True)
    author_qualification = Column(SQLEnum(QualificationCode), nullable=True)
    author_employment_type = Column(SQLEnum(EmploymentTypeCode), nullable=True)
    academic_title = Column(SQLEnum(AcademicTitle), nullable=True)
    
    assignments = relationship("Assignment", back_populates="staff")  # ADD
    account = relationship("Account", back_populates="user_profile")
    academic_unit = relationship(
        "OrganizationalUnit",
        back_populates="users"
    )

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    @property
    def email(self):
        return self.account.email if self.account else None

    @property
    def role(self):
        return self.account.role if self.account else None


class OrganizationalUnit(Base):
    __tablename__ = "organizational_unit"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    abbreviation = Column(String, nullable=True)
    unit_type = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    parent_id = Column(String, ForeignKey(
        "organizational_unit.id"), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    subnodes = relationship("OrganizationalUnit",
                            backref=backref("parent", remote_side=[id]))
    users = relationship("StaffProfile", back_populates="academic_unit",
                         foreign_keys="[StaffProfile.academic_unit_id]")

    assignments = relationship(
        "Assignment", back_populates="department", foreign_keys="[Assignment.department_id]")


class Industry(Base):
    __tablename__ = "industry"

    id = Column(String, primary_key=True, default=generate_uuid)
    account_id = Column(String, ForeignKey("account.id"),
                        unique=True, nullable=False)
    name = Column(String, nullable=False)

    account = relationship("Account", back_populates="industry_profile")
    contact_person = Column(String)
    phone = Column(String)
    industry_type = Column(String)
    efficiency_level = Column(String)
    address = Column(String)
    website = Column(String)
    status = Column(String, default="PENDING",nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    requests = relationship("IndustryRequest", back_populates="industry")

    @property
    def email(self):
        return self.account.email if self.account else None

    @property
    def role(self):
        return self.account.role if self.account else None


class IndustryLinkageOffice(Base):
    __tablename__ = "industry_linkage_office"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    email = Column(String)
    phone = Column(String)
    # role = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # admins = relationship("User", back_populates="office")


class IndustryRequest(Base):
    __tablename__ = "industry_request"

    id = Column(String, primary_key=True, default=generate_uuid)
    industry_id = Column(String, ForeignKey("industry.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    type = Column(String)
    status = Column(String, nullable=False)
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
    staff_id = Column(String, ForeignKey("staff_profile.id"))
    department_id = Column(String, ForeignKey("organizational_unit.id"))
    status = Column(String,nullable=False)
    progress = Column(String)
    assigned_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))

    request = relationship("IndustryRequest", back_populates="assignments")
    # assignments back_populates removed because User.assignments is commented
    staff = relationship("StaffProfile", back_populates="assignments")  # FIX
    department = relationship(
        "OrganizationalUnit", back_populates="assignments", foreign_keys=[department_id])


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
    status = Column(String,nullable=False)

    post_type = relationship("PostType", back_populates="posts")
    images = relationship("PostImage", back_populates="post")
    project = relationship("Project", back_populates="post", uselist=False)
    research_call = relationship(
        "ResearchCall", back_populates="post", uselist=False)
    job = relationship("Job", back_populates="post", uselist=False)
    success_story = relationship(
        "SuccessStory", back_populates="post", uselist=False)


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
    target_user_id = Column(String, ForeignKey("account.id"))
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
