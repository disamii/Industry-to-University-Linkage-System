import pandas as pd
from typing import Dict
import logging
import re
from django.db import transaction
from rest_framework.exceptions import ValidationError
import httpx
from typing import Optional, Dict, Any
from django.contrib.auth import get_user_model
from .serializers import UserFullSerializer
RPMS_BASE_URL = "http://10.161.65.18:8000"
RPMS_API_KEY = "sk_9f3a7c2d1b8e4f6a9c0d2e7f5a1b3c8d"
User = get_user_model()

logger = logging.getLogger(__name__)


def split_name(full_name):
    """
    Splits full name into 
    """
    parts = full_name.strip().split() if full_name else []
    first_name = parts[0] if len(parts) > 0 else ""
    father_name = parts[1] if len(parts) > 1 else ""
    grand_father_name = parts[2] if len(parts) > 2 else ""

    return first_name, father_name, grand_father_name



def read_users_from_excel(file_obj):
    
    """
    Reads users from Excel file.
    Expects columns: 'Full Name', 'Email'
    Skips rows with missing or blank data.
    """
    try:
        df = pd.read_excel(file_obj, engine='openpyxl')

        df.columns = [re.sub(r'\s+', ' ', col).strip().lower() for col in df.columns]
        required_columns = {'full name', 'email'}
        if not required_columns.issubset(df.columns):
            missing = ', '.join(required_columns - set(df.columns))
            raise ValidationError({"excel": f"Missing required columns: {missing}"})
        users = []
        for idx, row in df.iterrows():
            full_name = row.get('full name')
            email = row.get('email')
            if pd.isna(email) or not str(email).strip():
                continue


            email = str(email).strip()
            if pd.isna(full_name):
                full_name = ""
            else:
                full_name = str(full_name).strip()

            if  not email:
                continue

            try:
                first_name, father_name, grand_father_name = split_name(full_name)
                user_data = {
                    'first_name': first_name,
                    'father_name': father_name,
                    'grand_father_name': grand_father_name,
                    'email': email
                }
                users.append(user_data)
            except ValidationError:
                continue
        return users
    except Exception as e:
        logger.exception("Error reading Excel file")
        raise ValidationError(f"Error reading Excel file: {e}")

def get_user_from_rpms(email: str) -> Optional[Dict[str, Any]]:
    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(
                f"{RPMS_BASE_URL}/auth/private/user/",
                params={"email": email},
                headers={"X-API-KEY": RPMS_API_KEY}
            )

        if response.status_code == 200:
            return response.json()
        return None

    except Exception:
        return None

@transaction.atomic
def process_academic_unit(unit_data: Dict) -> int:
    from organizational_structure.models import OrganizationalUnit
    hierarchy = unit_data.get("hierarchy", [])
    parent = None
    unit = None

    for node in hierarchy:
        unit, _ = OrganizationalUnit.objects.get_or_create(
            name=node["name"],
            unit_type=node["unit_type"],
            parent=parent,
            defaults={
                "abbreviation": node.get("abbreviation"),
                "description": node.get("description"),
            },
        )
        parent = unit

    return unit.id if unit else None


def sso_from_rpms(email: str):
    data = get_user_from_rpms(email)

    if not data:
        return {"error": "User not found in RPMS"}

    user = User.objects.filter(email=email).first()
    if user:
        return UserFullSerializer(user).data

    academic_unit = data.get("academic_unit")
    academic_unit_id = process_academic_unit(academic_unit)

    data["academic_unit_id"] = academic_unit_id

    serializer = UserFullSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    return UserFullSerializer(user).data