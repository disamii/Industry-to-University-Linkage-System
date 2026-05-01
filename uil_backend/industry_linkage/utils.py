import re

def clean_phone(value: str) -> str:
    return re.sub(r"\D", "", value)