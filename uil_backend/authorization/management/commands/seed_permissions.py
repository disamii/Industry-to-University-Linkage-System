from django.core.management.base import BaseCommand
from authorization.models import Permission
from authorization.constants import PERMISSIONS

class Command(BaseCommand):
    help = "Seed permissions from constants.py"

    def handle(self, *args, **kwargs):
        for perm_code in PERMISSIONS:
            Permission.objects.get_or_create(code=perm_code)
        self.stdout.write(self.style.SUCCESS("Permissions seeded successfully!"))
