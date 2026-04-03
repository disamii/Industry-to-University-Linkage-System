import httpx
from typing import Optional, Dict, Any

RPMS_BASE_URL = "http://10.161.65.18:8000"
RPMS_API_KEY = "sk_9f3a7c2d1b8e4f6a9c0d2e7f5a1b3c8d"


async def get_user_from_rpms(email: str) -> Optional[Dict[str, Any]]:
    """
    Fetch user data from the RPMS system by email.
    
    Args:
        email: User's email address
        
    Returns:
        Dictionary with user data if found, or None if not found
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{RPMS_BASE_URL}/auth/private/user/",
                params={"email": email},
                headers={"X-API-KEY": RPMS_API_KEY}
            )
            
            if response.status_code == 200:
                return response.json()
            return None
    except Exception:
        return None
