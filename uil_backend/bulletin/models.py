from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from audit.models import AuditMixin

class Post(AuditMixin, models.Model):
    POST_TYPE_CHOICES = [
        ("success_story", "Success Story"),
        ("thematic_area", "Thematic Area"),
        ("open_request", "Open Industry Request"),
        ("announcement", "General Announcement"),
        ("guideline", "UIL Guideline/Manual"),
    ]

    title = models.CharField(max_length=255)
    post_type = models.CharField(max_length=30, choices=POST_TYPE_CHOICES)
    content = models.TextField(help_text="The main body of the post")
    
    content_type = models.ForeignKey(
        ContentType, 
        on_delete=models.CASCADE, 
        limit_choices_to={'model__in': ('request', 'assignment', 'user', 'industryprofile')},
        null=True, 
        blank=True
    )
    object_id = models.PositiveIntegerField(null=True, blank=True)
    related_object = GenericForeignKey('content_type', 'object_id')
    is_internal_only = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    image = models.ImageField(upload_to="posts/", blank=True, null=True)    
    expires_at = models.DateTimeField(
        null=True, 
        blank=True, 
        help_text="Optional: Post will be hidden after this date."
    )
    class Meta:
        ordering = ["-published_at"]
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
        ]