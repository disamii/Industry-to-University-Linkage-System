import httpx
from typing import Optional, Dict, Any
    
    
from models import OrganizationalUnit
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Dict

RPMS_BASE_URL = "http://10.161.65.18:8000"
RPMS_API_KEY = "sk_9f3a7c2d1b8e4f6a9c0d2e7f5a1b3c8d"


async def get_user_from_rpms(email: str) -> Optional[Dict[str, Any]]:
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
    except Exception as e:
        return e

def process_academic_unit(session: AsyncSession, unit_data: Dict) -> str:
    """
    Ensure academic unit hierarchy exists and return the id of the deepest unit.
    """
    hierarchy = unit_data.get("hierarchy", [])
    parent_id = None
    unit_id = None

    for node in hierarchy:
        stmt = select(OrganizationalUnit).where(
            OrganizationalUnit.name == node["name"],
            OrganizationalUnit.unit_type == node["unit_type"],
            OrganizationalUnit.parent_id == parent_id
        )
        result = session.execute(stmt)
        existing_unit = result.scalar_one_or_none()

        if existing_unit:
            unit_id = existing_unit.id
        else:
            # create new unit
            new_unit = OrganizationalUnit(
                name=node["name"],
                unit_type=node["unit_type"],
                abbreviation=node.get("abbreviation"),
                description=node.get("description"),
                parent_id=parent_id
            )
            session.add(new_unit)
            session.flush()  
            unit_id = new_unit.id
        parent_id = unit_id

    return unit_id