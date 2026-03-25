import enum
from sqlalchemy import Column, String, Integer, DateTime, Numeric, Date, ForeignKey, Text, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship, backref
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
    # users = relationship("User", back_populates="industry")

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

class OrganizationalUnit(Base):
    __tablename__ = "organizational_unit"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    abbreviation = Column(String, nullable=True)
    unit_type = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    parent_id = Column(String, ForeignKey("organizational_unit.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by_id = Column(String, ForeignKey("user.id"), nullable=True)
    updated_by_id = Column(String, ForeignKey("user.id"), nullable=True)
    
    # Hierarchy
    subnodes = relationship("OrganizationalUnit", backref=backref("parent", remote_side=[id]))
    
    created_by = relationship("User", foreign_keys=[created_by_id], backref="created_organization_structures")
    updated_by = relationship("User", foreign_keys=[updated_by_id], backref="updated_organization_structures")
    
    users = relationship("User", back_populates="department", foreign_keys="[User.department_id]")
    assignments = relationship("Assignment", back_populates="department", foreign_keys="[Assignment.department_id]")


from enum import Enum

class ISCEDBandCode(str, Enum):
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

    @classmethod
    def choices(cls):
        return [
            (cls.GENERIC, "Generic programmes and qualifications"),
            (cls.EDUCATION, "Education"),
            (cls.ARTS_HUMANITIES, "Arts and humanities"),
            (cls.SOCIAL_SCIENCES, "Social sciences, journalism and information"),
            (cls.BUSINESS_LAW, "Business, administration and law"),
            (cls.NATURAL_SCIENCES, "Natural sciences, mathematics and statistics"),
            (cls.ICT, "Information and Communication Technologies (ICTs)"),
            (cls.ENGINEERING, "Engineering, manufacturing and construction"),
            (cls.AGRICULTURE, "Agriculture, forestry, fisheries and veterinary"),
            (cls.HEALTH_WELFARE, "Health and welfare"),
            (cls.SERVICES, "Services"),
            (cls.FIELD_UNKNOWN, "Field unknown"),
        ]

class AuthorCategoryCode(str, Enum):
    ACADEMIC_STAFF = "AS"
    FIRST_DEGREE_STUDENT = "FDS"
    SECOND_DEGREE_STUDENT = "SDS"
    THIRD_DEGREE_STUDENT = "TDS"
    FULL_TIME_RESEARCHER = "FR"

    @classmethod
    def choices(cls):
        return [
            (cls.ACADEMIC_STAFF, "Academic Staff"),
            (cls.FIRST_DEGREE_STUDENT, "First Degree Student"),
            (cls.SECOND_DEGREE_STUDENT, "Second Degree Student"),
            (cls.THIRD_DEGREE_STUDENT, "Third Degree Student"),
            (cls.FULL_TIME_RESEARCHER, "Full Time Researcher"),
        ]

class AcademicRankCode(str, Enum):
    GRAD_ASSISTANT_I = "GRA-I"
    GRAD_ASSISTANT_II = "GRA-II"
    LECTURER = "LEC"
    ASSISTANT_PROFESSOR = "AST"
    ASSOCIATE_PROFESSOR = "ASC"
    PROFESSOR = "PRF"
    ASSISTANT_LECTURER = "AL"
    TECHNICAL_ASSISTANCE = 'TA'

    @classmethod
    def choices(cls):
        return [
            (cls.GRAD_ASSISTANT_I, "Graduate Assistant I"),
            (cls.GRAD_ASSISTANT_II, "Graduate Assistant II"),
            (cls.LECTURER, "Lecturer"),
            (cls.ASSISTANT_PROFESSOR, "Assistant Professor"),
            (cls.ASSOCIATE_PROFESSOR, "Associate Professor"),
            (cls.PROFESSOR, "Professor"),
            (cls.ASSISTANT_LECTURER, "Assistant Lecturer"),
            (cls.TECHNICAL_ASSISTANCE, "Technical Assistance")
        ]

class QualificationCode(str, Enum):
    BACHELOR = "BCH"
    HEALTH_SPECIALITY = "HSP"
    POST_GRAD_DIPLOMA = "PGD"
    MASTER = "MST"
    DOCTORATE = "PHD"
    HEALTH_SUB_SPECIALTY = "SSP"
    BACHELOR_TEACHING = "BCH-TE"

    @classmethod
    def choices(cls):
        return [
            (cls.BACHELOR, "Bachelor's degree"),
            (cls.HEALTH_SPECIALITY, "Health Speciality Certificate"),
            (cls.POST_GRAD_DIPLOMA, "Post graduate diploma"),
            (cls.MASTER, "Master's degree"),
            (cls.DOCTORATE, "Doctorate degree"),
            (cls.HEALTH_SUB_SPECIALTY, "Health Sub-Specialty"),
            (cls.BACHELOR_TEACHING, "Bachelor's degree in teaching"),
        ]

class EmploymentTypeCode(str, Enum):
    FULL_TIME = "FT"
    PART_TIME = "PT"
    JOINT_EDU = "JAEI"
    JOINT_INDUSTRY = "JAI"
    VISITING_PROFESSOR = "VP"

    @classmethod
    def choices(cls):
        return [
            (cls.FULL_TIME, "Full Time"),
            (cls.PART_TIME, "Part Time"),
            (cls.JOINT_EDU, "Jointly Appointed with other education institutions"),
            (cls.JOINT_INDUSTRY, "Jointly Appointed with the industry"),
            (cls.VISITING_PROFESSOR, "Visiting Professor"),
        ]

class AcademicTitle(str, Enum):
    MR = "MR"
    MRS = "MRS"
    MISS = "MISS"
    MS = "MS"
    DR = "DR"
    PROF = "PROF"

    @classmethod
    def choices(cls):
        return [
            (cls.MR, "Mr."),
            (cls.MRS, "Mrs."),
            (cls.MISS, "Miss"),
            (cls.MS, "Ms."),
            (cls.DR, "Dr."),
            (cls.PROF, "Professor")
        ]

class AuthorType(str, Enum):
    FIRST_AUTHOR = "FA"
    CO_AUTHOR = "COA"
    CORRESPONDING_AUTHOR = "CRA"

    @classmethod
    def choices(cls):
        return [
            (cls.FIRST_AUTHOR.value, "First Author"),
            (cls.CO_AUTHOR.value, "Co-Author"),
            (cls.CORRESPONDING_AUTHOR.value, "Corresponding Author")
        ]

class User(Base):
    __tablename__ = "user"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    username = Column(String, unique=True, nullable=True)
    first_name = Column(String, nullable=True)
    father_name = Column(String, nullable=True)
    grand_father_name = Column(String, nullable=True)
    
    status = Column(String, default="PENDING")
    user_type = Column(String, default="RESEARCHER") # e.g. 'COMPANY', 'OFFICE_ADMIN', 'RESEARCHER'
    must_change_password = Column(Boolean, default=False)
    # researcher profile field  
    # is_active = Column(Boolean, default=True)
    # is_superuser = Column(Boolean, default=False)
    
    # Researcher Profile Fields
    biography = Column(Text, nullable=True)
    research_interests = Column(Text, nullable=True)
    phone_number = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)
    
    author_gender = Column(String, nullable=True)
    publication_isced_band = Column(SQLEnum(ISCEDBandCode), nullable=True)
    
    author_category = Column(SQLEnum(AuthorCategoryCode), nullable=True)
    author_academic_rank = Column(SQLEnum(AcademicRankCode), nullable=True)
    author_qualification = Column(SQLEnum(QualificationCode), nullable=True)
    author_employment_type = Column(SQLEnum(EmploymentTypeCode), nullable=True)
    academic_title = Column(SQLEnum(AcademicTitle), nullable=True)
    
    department_id = Column(String, ForeignKey("organizational_unit.id"), nullable=True)
    # industry_id = Column(String, ForeignKey("industry.id"), nullable=True)
    # research_office_id = Column(String, ForeignKey("industry_linkage_office.id"), nullable=True)
    # office_admin_of_id = Column(String, ForeignKey("industry_linkage_office.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    department = relationship("OrganizationalUnit", back_populates="users", foreign_keys=[department_id])
    # office = relationship("IndustryLinkageOffice", back_populates="admins")
    # assignments = relationship("Assignment", back_populates="staff") # it will be many to many
    # industry = relationship("Industry", back_populates="users")

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
    department_id = Column(String, ForeignKey("organizational_unit.id"))
    status = Column(String)
    progress = Column(String)
    assigned_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    
    request = relationship("IndustryRequest", back_populates="assignments")
    staff = relationship("User") # assignments back_populates removed because User.assignments is commented
    department = relationship("OrganizationalUnit", back_populates="assignments", foreign_keys=[department_id])

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

