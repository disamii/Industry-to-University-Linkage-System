from rest_framework.exceptions import APIException
from rest_framework import status


class ExternalServiceException(APIException):
    status_code = status.HTTP_502_BAD_GATEWAY
    default_detail = "External service integration failed."
    default_code = "external_service_error"

    def __init__(self, detail=None, code=None):
        if detail is None:
            detail = self.default_detail
        super().__init__(detail, code)
