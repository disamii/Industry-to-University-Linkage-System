from fastapi import HTTPException


class APIException(HTTPException):
    def __init__(self, status_code: int = 400, detail: str = "Something went wrong", extra: dict | None = None):
        super().__init__(status_code=status_code, detail=detail)
        self.extra = extra


class BadRequestException(APIException):
    def __init__(self, detail: str = "Bad request"):
        super().__init__(status_code=400, detail=detail)


class UnauthorizedException(APIException):
    def __init__(self, detail: str = "Unauthorized"):
        super().__init__(status_code=401, detail=detail)


class ForbiddenException(APIException):
    def __init__(self, detail: str = "Forbidden"):
        super().__init__(status_code=403, detail=detail)


class ConflictException(APIException):
    def __init__(self, detail: str = "Conflict"):
        super().__init__(status_code=409, detail=detail)


class ValidationException(APIException):
    def __init__(self, detail: str = "Validation error", extra: dict | None = None):
        super().__init__(status_code=422, detail=detail, extra=extra)


class InternalServerErrorException(APIException):
    def __init__(self, detail: str = "Internal server error"):
        super().__init__(status_code=500, detail=detail)


class NotFoundException(APIException):
    def __init__(self, detail: str = "Not Found"):
        super().__init__(status_code=404, detail=detail)
