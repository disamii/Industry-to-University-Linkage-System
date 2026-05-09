from django.db import models


class PostType(models.TextChoices):
    SUCCESS_STORY = "success_story", "Success Story"
    THEMATIC_AREA = "thematic_area", "Thematic Area"
    OPEN_REQUEST = "open_request", "Open Industry Request"
    ANNOUNCEMENT = "announcement", "General Announcement"
    GUIDELINE = "guideline", "UIL Guideline/Manual"