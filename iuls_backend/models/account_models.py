from enums import AcademicRankCode, AcademicTitle, AuthorCategoryCode, EmploymentTypeCode, ISCEDBandCode, QualificationCode
from sqlalchemy import Column, String, DateTime,  ForeignKey, Text, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql import func
from db import Base
import uuid
from enums import UserRole




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
    academic_unit_id = Column(String, ForeignKey("organizational_unit.id"), nullable=True)

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
