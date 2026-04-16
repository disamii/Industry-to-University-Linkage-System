from rest_framework.permissions import BasePermission
from .models import OrganizationalUnit
from .enums import Position  

class IsAdminOrCoordinatorOrDirectorForOrgUnit(BasePermission):
    """
    Permission: Allow only Admins, Office Coordinators, or Office Directors
    for the given Organizational Unit.
    """

    message = (
        "You must be an admin, office coordinator, or director "
        "for the target organizational unit to perform this action."
    )

    def has_object_permission(self, request, view, obj):
        """
        obj can be:
        - OrganizationalUnit
        - ThematicArea
        - SubThematicArea
        """

        # ✅ Superusers always have full access
        if request.user and request.user.is_superuser:
            return True

        # Determine the organizational unit from the object
        if isinstance(obj, OrganizationalUnit):
            org_unit = obj
        elif hasattr(obj, "organizational_unit"):
            org_unit = obj.organizational_unit
        elif hasattr(obj, "parent_thematic_area"):
            # For sub-thematic area
            org_unit = obj.parent_thematic_area.organizational_unit
        else:
            return False  # Can't determine org unit → deny

        # ✅ Check if the user has a position in the allowed roles for this org unit
        return request.user.positions.filter(
            organizational_unit=org_unit,
            position__in=[
                Position.OFFICE_COORDINATOR,
                Position.OFFICE_DIRECTOR,
            ]
        ).exists()
