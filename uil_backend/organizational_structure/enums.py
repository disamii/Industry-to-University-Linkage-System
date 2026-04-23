
from django.db import models

class Position(models.TextChoices):
    CHAIR_HOLDER = "CHAIR_HOLDER", "Chair Holder"
    DEPARTMENT_HEAD = "DEPARTMENT_HEAD", "Department Head"
    FACULTY_DEAN = "FACULTY_DEAN", "Faculty Dean"
    OFFICE_DIRECTOR = "OFFICE_DIRECTOR", "Office Director"
    OFFICE_COORDINATOR = "OFFICE_COORDINATOR", "Office Coordinator"
    DEPUTY_SCIENTIFIC_DIRECTOR = "DEPUTY_SCIENTIFIC_DIRECTOR", "Deputy Scientific Director"
    SCIENTIFIC_DIRECTOR = "SCIENTIFIC_DIRECTOR", "Scientific Director"
    PRESIDENT = "PRESIDENT", "President"
    FINANCE_DIRECTOR = "FINANCE_DIRECTOR", "Finance Director"
    FINANCE_COORDINATOR = "FINANCE_COORDINATOR", "Finance Coordinator"
    FINANCE_OFFICER = "FINANCE_OFFICER", "Finance Officer"
    FINANCE_ASSISTANT = "FINANCE_ASSISTANT", "Finance Assistant"
    FINANCE_AUDITOR = "FINANCE_AUDITOR", "Finance Auditor"
    FINANCE_MANAGER = "FINANCE_MANAGER", "Finance Manager"
