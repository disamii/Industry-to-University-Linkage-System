from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

from audit.models import AuditMixin
User = get_user_model()
from django.conf import settings
from django.db import models



# Create your models here.
class ResearcherProfile(AuditMixin,models.Model):

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='researcherprofile')
    biography = models.TextField(null=True, blank=True)
    research_interests = models.TextField(null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)