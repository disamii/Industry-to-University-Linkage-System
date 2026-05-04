from django.db import models
from django.core.validators import RegexValidator

from django.conf import settings
from audit.models import AuditMixin
User = settings.AUTH_USER_MODEL



phone_validator = RegexValidator(
    regex=r'^\+?[0-9\-\s\(\)]{9,25}$',
    message="Invalid phone format"
)
class Industry(AuditMixin,models.Model):
    INDUSTRY_TYPE_CHOICES = [
        ("it", "IT"),
        ("manufacturing", "Manufacturing"),
        ("construction", "Construction"),
        ("healthcare", "Healthcare"),
        ("education", "Education"),
        ("other", "Other"),
    ]
    name = models.CharField(max_length=255,unique=True, null=False)
    industry_type = models.CharField(max_length=50, choices=INDUSTRY_TYPE_CHOICES)
    contact_person = models.OneToOneField(User,on_delete=models.CASCADE,related_name="industry_profile")
    industry_email = models.EmailField(blank=True, null=True)
    phone_number = models.CharField(max_length=20,blank=True, null=True, validators=[phone_validator])
    contact_person_phone_number = models.CharField(max_length=20,blank=True, null=True,validators=[phone_validator])
    location = models.CharField(max_length=255)
    address = models.TextField()
    description = models.TextField(blank=True, null=True)
    number_of_employees = models.PositiveIntegerField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)


    def __str__(self):
        return self.name

class Request(AuditMixin,models.Model):
    REQUEST_TYPE_CHOICES = [
        ("rnd", "Research & Development  Services"),
        ("tech_support", "Technology Support"),
        ("consultancy", "Consultancy"),
        ("testing", "Testing & QA"),
        ("training", "Training"),
        ("internship", "Internship/Externship"),
        ("recruitment", "Graduate Recruitment"),
        # universty request
        ("curriculum_review", "Curriculum Review"),
        ("industrial_visit", "Industrial Visit"),
        ("joint_research", "Joint Research"),
        ("guest_lecture", "Guest Lecturing"),
        ("lab_access", "Equipment / Lab Access"),
        ("tech_transfer", "IP / Technology Transfer"),
        ("other", "Other"),
    ]
    REQUESTING_ENTITY_CHOICES = [
        ("industry", "Industry"),
        ("academic_unit", "Academic Unit"),
    ]

    requesting_entity = models.CharField(
        max_length=20,
        choices=REQUESTING_ENTITY_CHOICES
    )
    
    type = models.CharField(max_length=50, choices=REQUEST_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    industry = models.ForeignKey(
        Industry,
        on_delete=models.CASCADE,
        related_name="requests"
    )
    academic_unit=models.ForeignKey(
            "organizational_structure.OrganizationalUnit",
            on_delete=models.CASCADE,
            related_name="requested"
        )

    description = models.TextField()
    attachment = models.FileField(
        upload_to="request_attachments/",
        blank=True,
        null=True
    )

class RequestAction(AuditMixin,models.Model):
    ACTION_TYPES = [
        ("created", "Created"),
        ("assigned", "Assigned"),
        ("forwarded", "Forwarded"),
        ("accept_forwarded", "Accept Forwarded"),
        ("posted_as_thematic", "Posted as Thematic Call"),
        ("replied", "Replied"),
        ("rejected","Rejected"),
        ("reassigned","Reassigned"),
        ("completed","Completed"),
        ("revoked","Revoked")
    ]
    request = models.ForeignKey(
        "Request",
        on_delete=models.CASCADE,
        related_name="actions"
    )

    type = models.CharField(max_length=30, choices=ACTION_TYPES)
    
    description = models.TextField()  
    
    assigned_user = models.ForeignKey(
        User, 
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="assignends"
    )

    from_industry = models.ForeignKey(
        Industry,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sent_transfers"
    )
    
    to_unit = models.ForeignKey(
        "organizational_structure.OrganizationalUnit",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="received_unit_transfers"  
    )
    
    from_unit = models.ForeignKey(
        "organizational_structure.OrganizationalUnit",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sent_unit_transfers"   
    )
    to_industry = models.ForeignKey(
        Industry,        
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="received_transfers_industry"  
    )   

class RnDRequest(models.Model):
    request = models.OneToOneField(Request, on_delete=models.CASCADE, related_name="rnd")
    problem_statement = models.TextField()
    research_area = models.CharField(max_length=255)

class TechnologySupportRequest(models.Model):
    request = models.OneToOneField( Request, on_delete=models.CASCADE, related_name="tech_support")
    technology_required = models.CharField(max_length=255, blank=True,
        null=True)
    required_duration = models.CharField(max_length=100, blank=True,
        null=True)

class ConsultancyRequest(models.Model):
    request = models.OneToOneField( Request, on_delete=models.CASCADE, related_name="consultancy")
    consultancy_type = models.CharField(max_length=255, blank=True,
        null=True)

class TrainingRequest(models.Model):
    request = models.OneToOneField(Request, on_delete=models.CASCADE, related_name="training")
    training_type = models.CharField(max_length=255, blank=True,
        null=True)
    number_of_trainees = models.PositiveIntegerField()
    trainee_level = models.CharField(max_length=100, blank=True,
        null=True)

class RecruitmentRequest(models.Model):
    request = models.OneToOneField(Request, on_delete=models.CASCADE, related_name="recruitment")
    field_of_study = models.CharField(max_length=255, blank=True,
        null=True)
    graduate_year = models.IntegerField(blank=True,
        null=True)
    requirements = models.TextField( blank=True,
        null=True)
    number_to_recruit = models.PositiveIntegerField( blank=True,
        null=True)

class InternshipRequest(models.Model):
    request = models.OneToOneField(Request, on_delete=models.CASCADE, related_name="internship")

    field_of_study = models.CharField(max_length=255)
    number_of_students = models.PositiveIntegerField()
    timeframe = models.CharField(max_length=100)
    activities = models.TextField()

class TestingRequest(models.Model):
    request = models.OneToOneField(Request, on_delete=models.CASCADE, related_name="testing")
    item_to_test = models.CharField(max_length=255)
    test_type = models.CharField(max_length=255)

class CurriculumReviewRequest(models.Model):
    request = models.OneToOneField(
        Request,
        on_delete=models.CASCADE,
        related_name="curriculum_review"
    )

    course_name = models.CharField(max_length=255)
    current_syllabus = models.FileField(upload_to="syllabus/")
    desired_industry_expertise = models.TextField()

class IndustrialVisitRequest(models.Model):
    request = models.OneToOneField(
        Request,
        on_delete=models.CASCADE,
        related_name="industrial_visit"
    )

    number_of_students = models.PositiveIntegerField()
    preferred_datetime = models.DateTimeField()
    department_to_visit = models.CharField(max_length=255)

class JointResearchRequest(models.Model):
    request = models.OneToOneField(
        Request,
        on_delete=models.CASCADE,
        related_name="joint_research"
    )

    research_topic = models.CharField(max_length=255)
    problem_statement = models.TextField()
    expected_industry_contribution = models.TextField()

class GuestLectureRequest(models.Model):
    request = models.OneToOneField(
        Request,
        on_delete=models.CASCADE,
        related_name="guest_lecture"
    )

    topic = models.CharField(max_length=255)
    datetime = models.DateTimeField()
    student_level = models.CharField(max_length=50)  
    duration = models.CharField(max_length=100)

class TechTransferRequest(models.Model):
    request = models.OneToOneField(
        Request,
        on_delete=models.CASCADE,
        related_name="tech_transfer"
    )

    innovation_description = models.TextField()
    technology_readiness_level = models.CharField(max_length=50)

class Assignment(AuditMixin, models.Model):
    request = models.ForeignKey(
        "Request", 
        on_delete=models.CASCADE, 
        related_name="assignments"
    )
    assigned_user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name="university_assignments"
    )
    
    start_date = models.DateField(help_text="When the work begins")
    end_date = models.DateField(help_text="When the work must be completed")

    
    industry_mentor = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        help_text="The industry person supervising the task"
    )

    status = models.CharField(
            max_length=20,
            choices=[
                ("accepted", "Accepted"),    # User agreed to do it
                ("rejected", "Rejected"),    # User declined (office needs to re-assign)
                ("active", "Active"),        # Work is currently happening
                ("completed", "Completed"),  # User finished the task
                ("cancelled", "Cancelled"),  # Office or industry stopped the task
            ],
            default="pending"
        )
    class Meta:
        unique_together = ('request', 'assigned_user')