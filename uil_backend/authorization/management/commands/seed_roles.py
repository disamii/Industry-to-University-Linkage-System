from django.core.management.base import BaseCommand
from authorization.models import Role

class Command(BaseCommand):
    help = "Seed default roles"

    def handle(self, *args, **options):
        roles = [
            "Super Admin",
            "Staff",
            "Industry",
            "Admin"
        ]

        for role in roles:
            Role.objects.get_or_create(name=role)

        self.stdout.write(self.style.SUCCESS("Roles seeded successfully"))
