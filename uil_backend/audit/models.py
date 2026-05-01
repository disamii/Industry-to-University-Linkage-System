from django.db import models
from django.contrib.auth import get_user_model


class AuditMixin(models.Model):
    created_by_id = models.BigIntegerField(null=True, blank=True)
    updated_by_id = models.BigIntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def is_owner(self, user) -> bool:
        if not user.is_authenticated:
            return False
        return self.created_by_id == user.id

    @property
    def created_by(self):
        User = get_user_model()
        if self.created_by_id:
            return User.objects.filter(id=self.created_by_id).first()
        return None

    @property
    def updated_by(self):
        User = get_user_model()
        if self.updated_by_id:
            return User.objects.filter(id=self.updated_by_id).first()
        return None