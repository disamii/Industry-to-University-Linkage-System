from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework.exceptions import (
    ValidationError, AuthenticationFailed, NotAuthenticated,
    PermissionDenied, NotFound, MethodNotAllowed,
    Throttled, APIException
)
from rest_framework_simplejwt.exceptions import InvalidToken
from .exceptions import ExternalServiceException
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    def format_error(error_code, message, details=None, status_code=500):
        return {
            "status": status_code,
            "error": error_code,
            "message": message,
            "details": details
        }

    if response is not None:
        status_code = response.status_code

        if isinstance(exc, ValidationError):
            response.data = format_error(
                "validation_error",
                "Validation failed.",
                details=response.data,
                status_code=status_code
            )
        elif isinstance(exc, InvalidToken):
            response.data = format_error(
                "invalid_token",
                "session expired.login again",
                status_code=status_code
            )
        elif isinstance(exc, AuthenticationFailed):
            response.data = format_error(
                "authentication_failed",
                str(exc.detail),
                status_code=status_code
            )
        elif isinstance(exc, NotAuthenticated):
            response.data = format_error(
                "not_authenticated",
                "Authentication credentials were not provided.",
                status_code=status_code
            )
        elif isinstance(exc, PermissionDenied):
            response.data = format_error(
                "permission_denied",
                str(exc.detail),
                status_code=status_code
            )
        elif isinstance(exc, NotFound):
            message = str(exc.detail) if exc.detail else "The requested resource was not founhd."
            response.data = format_error(
                "not_found",
                message,
                status_code=status_code
            )

        elif isinstance(exc, MethodNotAllowed):
            response.data = format_error(
                "method_not_allowed",
                exc.detail,
                status_code=status_code
            )
        elif isinstance(exc, Throttled):
            response.data = format_error(
                "throttled",
                "Request was throttled. Please try again later.",
                details={"wait": exc.wait},
                status_code=status_code
            )

        elif isinstance(exc, APIException):
            response.data = format_error(
                "api_exception",
                str(exc.detail),
                status_code=status_code
            )
        elif  isinstance(exc,ExternalServiceException):
            response.data = format_error(
                "external_service_error",
                str(exc.detail),
                status_code=status_code
            )

    else:
        logger.exception("Unhandled exception in API")
        response = Response(
            format_error(
                "server_error",
                "An unexpected error occurred.",
                status_code=500
            ),
            status=500
        )

    return response
