def require_permissions(*permissions):
    if len(permissions) == 1 and isinstance(permissions[0], (list, tuple)):
        permissions = tuple(permissions[0])
        
    def decorator(func):
        func.required_permissions = permissions
        if hasattr(func, "cls"):
            func.cls.required_permissions = permissions
        return func
    return decorator
