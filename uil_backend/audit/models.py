from django.db import models
from django.conf import settings



class AuditMixin(models.Model):
    """
    Abstract model to track who created/updated an object, when,
    and provide an `is_owner` helper.
    """
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_%(class)s_set"
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="updated_%(class)s_set"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True

    def is_owner(self, user) -> bool:
        """Return True if the given user is the creator of this object."""
        if not user.is_authenticated:
            return False
        return self.created_by_id == user.id