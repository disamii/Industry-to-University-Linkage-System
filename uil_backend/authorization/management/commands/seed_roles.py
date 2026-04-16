from django.core.management.base import BaseCommand
from authorization.models import Role

class Command(BaseCommand):
    help = "Seed default roles"

    def handle(self, *args, **options):
        roles = [
            "Researcher",
            "College Vice Dean",
            "College Dean",
            "Central Director",
            "Corporate Director",
            "RCE VP",
            "President",
            "Library Staff",
            "Publication Office",
            "IT Directorate",
            "Super Admin",
            "Admin"
        ]

        for role in roles:
            Role.objects.get_or_create(name=role)

        self.stdout.write(self.style.SUCCESS("Roles seeded successfully"))
