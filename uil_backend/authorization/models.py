from django.db import models
from django.contrib.auth import get_user_model
from organizational_structure.models import OrganizationalUnit
from audit.models import AuditMixin
from django.conf import settings

User = get_user_model()


class Role(AuditMixin,models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    def __str__(self):
        return self.name


class Permission(AuditMixin, models.Model):
    code = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    def __str__(self):
        return self.code


class RolePermission(AuditMixin,models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name="role_permissions")
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE, related_name="permission_roles")
    class Meta:
        unique_together = ("role", "permission")



class UserRole(AuditMixin,models.Model):
    user = models.ForeignKey(        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user_roles")
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name="role_users")
    organizational_unit = models.ForeignKey(
        OrganizationalUnit,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="user_roles"
    )

    class Meta:
        unique_together = ("user", "role", "organizational_unit")

    def __str__(self):
        unit = f" in {self.organizational_unit}" if self.organizational_unit else ""
        return f"{self.user} -> {self.role}{unit}"
    
