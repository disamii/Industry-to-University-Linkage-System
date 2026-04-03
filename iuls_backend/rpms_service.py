from typing import Optional, Dict, Any
from models import UserRole


def get_user_from_rpms(email: str) -> Optional[Dict[str, Any]]:
    """
    Mock RPMS service function to simulate fetching user data from RPMS system.
    In production, this would make an actual API call to the RPMS system.
    
    Args:
        email: User's email address
        
    Returns:
        Dictionary with user data matching User model structure, or None if not found
    """
    
    # Mock database of RPMS users
    mock_rpms_users = {
        "student@example.com": {
            "email": "student@example.com",
            "password": "rpms_password",
            "first_name": "Test",
            "father_name": "Student",
            "grand_father_name": "Name",
            "biography": "Test student biography",
            "research_interests": "Machine Learning, AI, Data Science",
            "phone_number": "+251911234567",
            "author_gender": "M",
            "publication_isced_band": None,
            "author_category": None,
            "author_academic_rank": None,
            "author_qualification": None,
            "author_employment_type": None,
            "academic_title": None,
            "academic_unit_id": None,
            "status": "ACTIVE",
            "must_change_password": False
        },
        "faculty@example.com": {
            "email": "faculty@example.com",
            "password": "rpms_password",
            "first_name": "Test",
            "father_name": "Faculty",
            "grand_father_name": "Member",
            "biography": "Test faculty biography",
            "research_interests": "Software Engineering, Web Development",
            "phone_number": "+251912345678",
            "author_gender": "F",
            "publication_isced_band": None,
            "author_category": None,
            "author_academic_rank": None,
            "author_qualification": None,
            "author_employment_type": None,
            "academic_title": None,
            "academic_unit_id": None,
            "status": "ACTIVE",
            "must_change_password": False
        }
    }
    
    return mock_rpms_users.get(email)
