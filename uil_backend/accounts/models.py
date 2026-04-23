from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db.models import Q


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        # extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('status','APPROVED')
        
        return self.create_user(email, password, **extra_fields)



class User(AbstractBaseUser, PermissionsMixin):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    ]
    
    username = models.CharField(max_length=255, unique=True, null=False)
    first_name = models.CharField(max_length=255, null=True, blank=True)
    father_name = models.CharField(max_length=255, null=True, blank=True)
    grand_father_name = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(null=False, unique=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="PENDING")
    must_change_password = models.BooleanField(default=False)
    raw_password = models.CharField(max_length=128, null=True, blank=True)
    academic_unit = models.ForeignKey("organizational_structure.OrganizationalUnit", 
                                      on_delete=models.SET_NULL, 
                                      null=True, 
                                      blank=True,  
                                      related_name="users")
    created_by = models.ForeignKey(
        'self',  
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name="users_created"
    )
    
    updated_by = models.ForeignKey(
        'self',  
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name="users_updated"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    # is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    objects = CustomUserManager()
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    def get_full_name(self):
        parts = [self.first_name, self.father_name, self.grand_father_name]
        return " ".join(part for part in parts if part).strip()
    
    def __str__(self):
        return f"{self.first_name} {self.father_name}"
    
    def has_perm(self, perm_code: str, organizational_unit=None) -> bool:
        if self.is_superuser:
            return True

        if not hasattr(self, "_cached_permissions"):
            self._cached_permissions = set(
                self.user_roles
                    .select_related("organizational_unit")
                    .values_list(
                        "role__role_permissions__permission__code",
                        "organizational_unit_id",
                    )
            )
        for code, org_id in self._cached_permissions:
            if code != perm_code:
                continue
            if organizational_unit is None:
                return True
            if org_id is None:
                return True
            if organizational_unit.is_descendant_of(org_id):
                return True
        return False
    
    def is_owner(self, user) -> bool:
        """Return True if the given user is the creator of this object."""
        if not user.is_authenticated:
            return False
        return self.id == user.id
