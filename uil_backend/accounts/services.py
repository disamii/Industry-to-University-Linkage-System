import pandas as pd
from rest_framework.exceptions import ValidationError
import re
import logging
 
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