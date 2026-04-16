import enum
from enum import Enum
class UserRole(Enum):
    USER = "user"
    ADMIN = "admin"
    INDUSTRY = "industry"

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

class AssignmentStatus(str, Enum):
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"

class RequestStatus(str, Enum):
    PENDING = "PENDING"
    IN_REVIEW = "IN_REVIEW"
    ASSIGNED = "ASSIGNED"
    REJECTED = "REJECTED"

class RequestPriority(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    
from enum import Enum


class RequestType(str, Enum):
    TECHNICAL_SUPPORT = "technical_support"
    RESEARCH_COLLABORATION = "research_collaboration"
    WORKSHOP = "workshop"
    SEMINAR = "seminar"
    EMPLOYEE_TRAINING = "employee_training"
    INTERNSHIP = "internship"
    MAINTENANCE = "maintenance"   
    OTHER="other"