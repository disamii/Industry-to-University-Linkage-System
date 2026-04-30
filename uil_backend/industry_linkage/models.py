from django.db import models
from django.conf import settings
from audit.models import AuditMixin
User = settings.AUTH_USER_MODEL


class Industry(AuditMixin,models.Model):
    INDUSTRY_TYPE_CHOICES = [
        ("it", "IT"),
        ("manufacturing", "Manufacturing"),
        ("construction", "Construction"),
        ("healthcare", "Healthcare"),
        ("education", "Education"),
        ("other", "Other"),
    ]
    name = models.CharField(max_length=255)
    industry_type = models.CharField(max_length=50, choices=INDUSTRY_TYPE_CHOICES)
    contact_person = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="industry_profile"
    )
    industry_email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20,blank=True, null=True)
    contact_person_phone_number = models.CharField(max_length=20,blank=True, null=True)
    location = models.CharField(max_length=255)
    address = models.TextField()
    description = models.TextField(blank=True, null=True)
    number_of_employees = models.PositiveIntegerField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)


    def __str__(self):
        return self.name

class IndustryRequest(AuditMixin,models.Model):
    REQUEST_TYPE_CHOICES = [
        ("rnd", "Research & Development  Services"),
        ("tech_support", "Technology Support"),
        ("consultancy", "Consultancy"),
        ("testing", "Testing & QA"),
        ("training", "Training"),
        ("internship", "Internship/Externship"),
        ("recruitment", "Graduate Recruitment"),
        ("other","Other")
        
    ]

    type = models.CharField(max_length=50, choices=REQUEST_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    industry = models.ForeignKey(
        Industry,
        on_delete=models.CASCADE,
        related_name="requests"
    )
    requested_to=models.ForeignKey(
            "organizational_structure.OrganizationalUnit",
            on_delete=models.CASCADE,
            related_name="industry_requests"
        )

    description = models.TextField()
    attachment = models.FileField(
        upload_to="request_attachments/",
        blank=True,
        null=True
    )




class IndustryRequestAction(AuditMixin,models.Model):
    ACTION_TYPES = [
        ("created", "Created"),
        ("assigned", "Assigned"),
        ("forwarded", "Forwarded"),
        ("accept_forwarded", "Accept Forwarded"),
        ("replied", "Replied"),
    ]
    request = models.ForeignKey(
        "IndustryRequest",
        on_delete=models.CASCADE,
        related_name="actions"
    )

    type = models.CharField(max_length=30, choices=ACTION_TYPES)

    description = models.TextField()  

    performed_by = models.ForeignKey(
        User,        
        on_delete=models.SET_NULL,
        null=True,
        related_name="performed_actions"
    )

    from_industry = models.ForeignKey(
        Industry,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sent_transfers"
    )

    from_unit = models.ForeignKey(
        "organizational_structure.OrganizationalUnit",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sent_transfers"
    )

    to_industry = models.ForeignKey(
        Industry,        
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="received_transfers"
    )

    to_unit = models.ForeignKey(
        "organizational_structure.OrganizationalUnit",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="received_transfers"
    )
    forwarded_to = models.ForeignKey(
        "organizational_structure.OrganizationalUnit",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="received_forwards"
    )
    forwarded_from  = models.ForeignKey(
        "organizational_structure.OrganizationalUnit",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sent_forwards"
    )


class RequestAssignment(models.Model):
    STATUS_CHOICES = [
        ("in_progress", "In Progress"),
        ("cancelled", "Cancelled"),
        ("completed", "Completed"),
    ]

    ROLE_CHOICES = [
        ("pi", "Principal Investigator"),
        ("member", "Member"),
    ]

    request = models.ForeignKey(
        IndustryRequest,
        on_delete=models.CASCADE,
        related_name="assignments"
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="assignments"
    )

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default="member"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="assigned"
    )

    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    assigned_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.user} -> {self.request} ({self.role})"
class RnDRequest(models.Model):
    request = models.OneToOneField(IndustryRequest, on_delete=models.CASCADE, related_name="rnd")

    problem_statement = models.TextField()
    research_area = models.CharField(max_length=255)
class TechnologySupportRequest(models.Model):
    request = models.OneToOneField( IndustryRequest, on_delete=models.CASCADE, related_name="tech_support")
    technology_required = models.CharField(max_length=255, blank=True,
        null=True)
    required_duration = models.CharField(max_length=100, blank=True,
        null=True)

class ConsultancyRequest(models.Model):
    request = models.OneToOneField( IndustryRequest, on_delete=models.CASCADE, related_name="consultancy")
    consultancy_type = models.CharField(max_length=255, blank=True,
        null=True)

class TrainingRequest(models.Model):
    request = models.OneToOneField(IndustryRequest, on_delete=models.CASCADE, related_name="training")
    training_type = models.CharField(max_length=255, blank=True,
        null=True)
    number_of_trainees = models.PositiveIntegerField()
    trainee_level = models.CharField(max_length=100, blank=True,
        null=True)

class RecruitmentRequest(models.Model):
    request = models.OneToOneField(IndustryRequest, on_delete=models.CASCADE, related_name="recruitment")
    field_of_study = models.CharField(max_length=255, blank=True,
        null=True)
    graduate_year = models.IntegerField(blank=True,
        null=True)
    requirements = models.TextField( blank=True,
        null=True)
    number_to_recruit = models.PositiveIntegerField( blank=True,
        null=True)
class InternshipRequest(models.Model):
    request = models.OneToOneField(IndustryRequest, on_delete=models.CASCADE, related_name="internship")

    field_of_study = models.CharField(max_length=255)
    number_of_students = models.PositiveIntegerField()
    timeframe = models.CharField(max_length=100)
    activities = models.TextField()
class TestingRequest(models.Model):
    request = models.OneToOneField(IndustryRequest, on_delete=models.CASCADE, related_name="testing")
    item_to_test = models.CharField(max_length=255)
    test_type = models.CharField(max_length=255)