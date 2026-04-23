from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from rest_framework.response import Response

class Handle404Middleware(MiddlewareMixin):
    def process_response(self, request, response):
        # Only override if it's a Django 404 (not DRF's Response)
        if response.status_code == 404 and not isinstance(response, Response):
            json_response = JsonResponse({
                "status": 404,
                "error": "NOT_FOUND",
                "message": "The requested resource was not found",
                "details": ''
            })
            json_response.status_code = 404
            return json_response
        return response
