from urllib import response

from rest_framework.pagination import PageNumberPagination

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from django.db.models import Q
# pagination.py
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from authorization.utilis import get_parent_scope
from organizational_structure.models import OrganizationalUnit
from organizational_structure.serializers import OrganizationStructureListSerializer

class UserPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"

    def paginate_queryset(self, queryset, request, view=None):
        self.base_queryset = queryset
        return super().paginate_queryset(queryset, request, view)

    def get_paginated_response(self, data):
        user = getattr(self.request, "user", None)
        perms = getattr(self.request, "required_permissions", None)
        parent_scope = getattr(self.request, "parent_scope", None)
        qs = self.base_queryset
        if user and user.is_authenticated and not parent_scope:
            if user.is_superuser:
                parent_scope = OrganizationalUnit.objects.filter(parent__isnull=True)
            elif perms:
                parent_scope = get_parent_scope(user, perms)
        response = {}
        
        if parent_scope is not None:
            if isinstance(parent_scope, OrganizationalUnit):
                parent_scope = [parent_scope]  
            response["scope"] = {
                "parent_units": OrganizationStructureListSerializer(
                    parent_scope, many=True
                ).data
            }
        response.update({   
        
            "counts": {
                "total_users": qs.count(),
                "Pending_approvals": qs.filter(status="PENDING").count(),
                "approved_users": qs.filter(status="APPROVED").count(),
                "rejected_users": qs.filter(status="REJECTED").count(),
                "users_with_Profile": qs.filter(researcherprofile__isnull=False).count(),
            },
            "pagination": {
                "links": {
                    "next": self.get_next_link(),
                    "previous": self.get_previous_link(),
                },
                "total": self.page.paginator.count,
                "page_size": self.get_page_size(self.request),
                "current_page": self.page.number,
                "total_pages": self.page.paginator.num_pages,
            },
            "results": data,
        })
        return Response(response)
