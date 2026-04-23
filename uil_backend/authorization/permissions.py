from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
# from authorization.utilis import is_approved_author

class HasRequiredPermissions(BasePermission):
    """
    Checks if the user has all permissions listed in view.required_permissions.
    """

    def has_permission(self, request, view):
        if not  request.user.is_authenticated :
            return False
        
        if request.user.is_superuser:
            return True
        perms = getattr(view, "required_permissions", None)
        if not perms:
            return True 
        organizational_unit = getattr(view, "target_scope", None)
        return all(request.user.has_perm(perm, organizational_unit) for perm in perms)
    
    def has_object_permission(self, request, view, obj):
        perms = getattr(view, "required_permissions", None)
        if not perms:
            return False

        target_scope = getattr(view, "target_scope", None)

        if isinstance(target_scope, (list, tuple, set)):
            return any(
                all(request.user.has_perm(perm, scope) for perm in perms)
                for scope in target_scope
            )
        else:
            return all(request.user.has_perm(perm, target_scope) for perm in perms)

class IsOwnerOrHasRequiredPermissions(BasePermission):
    
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        if obj.is_owner(request.user):
            return True

        perms = getattr(view, "required_permissions", None)
        if not perms:
            return False

        organizational_unit = getattr(view, "target_scope", None)
        if isinstance(organizational_unit, (list, tuple, set)):
            return any(
                all(request.user.has_perm(perm, scope) for perm in perms)
                for scope in organizational_unit
            )
        else:
            return all(request.user.has_perm(perm, organizational_unit) for perm in perms)

class IsAuthorOrHasRequiredPermissions(BasePermission):
    
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        # if is_approved_author(request.user, obj.id):
        #     return True

        perms = getattr(view, "required_permissions", None)
        if not perms:
            return False

        organizational_unit = getattr(view, "target_scope", None)
        if isinstance(organizational_unit, (list, tuple, set)):
            return any(
                all(request.user.has_perm(perm, scope) for perm in perms)
                for scope in organizational_unit
            )
        else:
            return all(request.user.has_perm(perm, organizational_unit) for perm in perms)


class PermissionContext:
    """
    Minimal object to pass required attributes to DRF permissions
    when used in function-based views.
    """
    def __init__(self, required_permissions=None, target_scope=None):
        self.required_permissions = required_permissions or []
        self.target_scope = target_scope


def check_object_permission(request, permission_class, obj, required_permissions=None, target_scope=None):
    """
    Checks object-level permissions for function-based views.

    Args:
        request: DRF request object
        permission_class: a DRF BasePermission class (not instance)
        obj: the object to check
        required_permissions: list of permission strings
        target_scope: object or value representing the scope

    Raises:
        PermissionDenied if the permission check fails
    """
    context = PermissionContext(required_permissions=required_permissions, target_scope=target_scope)
    permission = permission_class()
    if not permission.has_object_permission(request, context, obj):
        raise PermissionDenied("You do not have permission to perform this action.")

from rest_framework.permissions import BasePermission

class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(user.is_authenticated and user.is_superuser )
