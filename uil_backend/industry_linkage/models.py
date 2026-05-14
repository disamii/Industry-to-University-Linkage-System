from unittest import result

from django.db import models
from django.core.validators import RegexValidator
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.conf import settings
from audit.models import AuditMixin
from .enums import ActionTypes, AssignmentStatus, IndustryType, RequestType, RequestingEntity
from rest_framework.exceptions import ValidationError
User = settings.AUTH_USER_MODEL


phone_validator = RegexValidator(
    regex=r'^\+?[0-9\-\s\(\)]{9,25}$',
    message="Invalid phone format"
)


class Industry(AuditMixin, models.Model):

    name = models.CharField(max_length=255, unique=True, null=False)
    industry_type = models.CharField(
        max_length=50, choices=IndustryType.choices)
    contact_person = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="industry_profile")
    industry_email = models.EmailField(blank=True, null=True)
    phone_number = models.CharField(
        max_length=20, blank=True, null=True, validators=[phone_validator])
    contact_person_phone_number = models.CharField(
        max_length=20, blank=True, null=True, validators=[phone_validator])
    location = models.CharField(max_length=255, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    number_of_employees = models.PositiveIntegerField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name


class Request(AuditMixin, models.Model):

    requesting_entity = models.CharField(
        max_length=20,
        choices=RequestingEntity.choices,
    )

    type = models.CharField(max_length=50, choices=RequestType.choices)
    title = models.CharField(max_length=255)
    industry = models.ForeignKey(
        Industry,
        on_delete=models.CASCADE,
        related_name="requests"
    )
    academic_unit = models.ForeignKey(
        "organizational_structure.OrganizationalUnit",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="requested"
    )
    academic_unit_name = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        help_text="Used when the exact academic unit is unknown"
    )
    requested_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="requests"
    )

    description = models.TextField()
    attachment = models.FileField(
        upload_to="request_attachments/",
        blank=True,
        null=True
    )


class RequestAction(AuditMixin, models.Model):

    request = models.ForeignKey(
        "Request",
        on_delete=models.CASCADE,
        related_name="actions"
    )

    type = models.CharField(max_length=30, choices=ActionTypes.choices)

    description = models.TextField()
    # for action that needs response we call them active
    awaiting_decision = models.BooleanField(default=False)

    resulted_content_type = models.ForeignKey(
        ContentType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="requestaction_resulted"
    )

    resulted_object_id = models.PositiveIntegerField(null=True, blank=True)

    resulted_object = GenericForeignKey(
        "resulted_content_type",
        "resulted_object_id"
    )

    from_content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        related_name="actions_sent",
        null=True, blank=True
    )

    from_object_id = models.PositiveIntegerField(null=True, blank=True)
    actor_from = GenericForeignKey('from_content_type', 'from_object_id')

    to_content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        related_name="actions_received",
        null=True, blank=True
    )
    to_object_id = models.PositiveIntegerField(null=True, blank=True)
    actor_to = GenericForeignKey('to_content_type', 'to_object_id')

    class Meta:
        verbose_name = "Request Action"
        verbose_name_plural = "Request Actions"


class Assignment(AuditMixin, models.Model):

    request = models.ForeignKey(
        "Request",
        on_delete=models.CASCADE,
        related_name="assignments"
    )

    assigned_users = models.ManyToManyField(
        User,
        through="AssignmentMember",
        related_name="assignments"
    )

    start_date = models.DateField(help_text="When the work begins")
    end_date = models.DateField(help_text="When the work must be completed")
    visible_to_industry = models.BooleanField(default=False)

    industry_mentor = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="The industry person supervising the task"
    )

    status = models.CharField(
        max_length=20,
        choices=AssignmentStatus.choices,
        default=AssignmentStatus.PENDING,
    )

    def change_status(self, user, new_status):
        """
        Only PI can change assignment status.
        """

        if not self.members.filter(user=user, is_pi=True).exists():
            raise ValidationError(
                "Only the Principal Investigator can change status.")

        self.status = new_status
        self.save(update_fields=["status"])


class AssignmentMember(models.Model):
    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.CASCADE,
        related_name="members"
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    is_pi = models.BooleanField(default=False)

    class Meta:
        unique_together = ("assignment", "user")

    def clean(self):
        """
        Ensure only one PI per assignment.
        """

        if self.is_pi:
            existing_pi = AssignmentMember.objects.filter(
                assignment=self.assignment,
                is_pi=True
            ).exclude(pk=self.pk)

            if existing_pi.exists():
                raise ValidationError(
                    "An assignment can only have one Principal Investigator."
                )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
