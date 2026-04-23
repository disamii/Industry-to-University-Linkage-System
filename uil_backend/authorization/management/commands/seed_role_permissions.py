from django.core.management.base import BaseCommand
from authorization.models import Role, Permission, RolePermission
from authorization.constants import PERMISSIONS
ROLE_PERMISSION_MAP = {
    "Super Admin": PERMISSIONS,
    
    "Publication Office": [
        "can_read_researcher_profile_list",
        "can_read_publication_list",
        "can_update_publication",
        "can_delete_publication",
        "can_update_publication_index",
        "can_read_authorship_list",
        "can_delete_authorship",
        "can_update_authorship_status"
    ],

    "College Vice Dean": [

    ],

    # College Dean
    "College Dean": [

    ],

    # Library Staff
    "Library Staff": [

    ],


    "IT Directorate": [

    ],

    # Central Director
    "Central Director": [

    ],

    # Corporate Director
    "Corporate Director": [

    ],

    # RCE VP
    "RCE VP": [
 
    ],

    # President
    "President": [

    ],
}


class Command(BaseCommand):
    help = "Seed Role-Permission mappings"

    def handle(self, *args, **kwargs):
        missing_permissions = []

        for role_name, perms in ROLE_PERMISSION_MAP.items():
            role = Role.objects.get(name=role_name)

            for perm_code in perms:
                try:
                    permission = Permission.objects.get(code=perm_code)
                except Permission.DoesNotExist:
                    missing_permissions.append(
                        f"Role='{role_name}' Permission='{perm_code}'"
                    )
                    continue

                RolePermission.objects.get_or_create(
                    role=role,
                    permission=permission
                )

        if missing_permissions:
            self.stdout.write(self.style.WARNING("Missing permissions:"))
            for msg in missing_permissions:
                self.stdout.write(self.style.WARNING(f" - {msg}"))

        self.stdout.write(self.style.SUCCESS("Role-Permission mappings seeded!"))