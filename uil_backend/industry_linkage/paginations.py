from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from django.db.models import Count, Q
from django.utils.timezone import now

from authorization.utilis import get_parent_scope
from organizational_structure.models import OrganizationalUnit


class IndustryPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = "page_size"

    def paginate_queryset(self, queryset, request, view=None):
        self.base_queryset = queryset

        user = getattr(request, "user", None)
        perms = getattr(request, "required_permissions", None)

        self.scope = None

        if user and user.is_authenticated:
            if user.is_superuser:
                self.scope = OrganizationalUnit.objects.filter(parent__isnull=True)
            elif perms:
                self.scope = get_parent_scope(user, perms)

        return super().paginate_queryset(queryset, request, view)

    def get_paginated_response(self, data):
        qs = self.base_queryset
        current_year = now().year

        if self.scope:
            qs = qs.filter(
                requests__academic_unit__in=self.scope
            ).distinct()

        stats = qs.aggregate(
            total=Count("id"),

            industries_with_requests=Count(
                "id",
                filter=Q(requests__isnull=False),
                distinct=True
            ),

            industries_registered_this_year=Count(
                "id",
                filter=Q(created_at__year=current_year)
            ),
        )

        return Response({
            "stats": stats,

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
        


from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from django.db.models import OuterRef, Subquery, Count, Q
from django.utils.timezone import now

from organizational_structure.models import OrganizationalUnit
from authorization.utilis import get_parent_scope
from .models import Request, RequestAction

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from django.db.models import OuterRef, Subquery, Count, Q
from django.utils.timezone import now

from .models import Request, RequestAction


class RequestForIndustryPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"

    def paginate_queryset(self, queryset, request, view=None):
        self.base_queryset = queryset

        latest_action = RequestAction.objects.filter(
            request=OuterRef("pk")
        ).order_by("-created_at")

        queryset = queryset.annotate(
            last_action=Subquery(latest_action.values("type")[:1])
        )

        return super().paginate_queryset(queryset, request, view)

    def get_paginated_response(self, data):
        from django.db.models import OuterRef, Subquery, Count, Q
        from django.utils.timezone import now

        qs = self.base_queryset
        current_year = now().year

        # 🔥 RE-ANNOTATE HERE (CRITICAL FIX)
        latest_action = RequestAction.objects.filter(
            request=OuterRef("pk")
        ).order_by("-created_at")

        qs = qs.annotate(
            last_action=Subquery(latest_action.values("type")[:1])
        )

        stats = qs.aggregate(
            total_requests=Count("id"),

            created_requests=Count(
                "id",
                filter=Q(last_action="created")
            ),

            assigned_requests=Count(
                "id",
                filter=Q(last_action="assigned")
            ),

            completed_requests=Count(
                "id",
                filter=Q(last_action="completed")
            ),
        )

        return Response({
            "stats": stats,
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

class RequestPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"

    def paginate_queryset(self, queryset, request, view=None):
        self.base_queryset = queryset

        user = getattr(request, "user", None)
        perms = getattr(request, "required_permissions", None)

        self.scope = None

        if user and user.is_authenticated:
            if user.is_superuser:
                self.scope = OrganizationalUnit.objects.filter(parent__isnull=True)
            elif perms:
                self.scope = get_parent_scope(user, perms)

        # APPLY SCOPE
        if self.scope:
            queryset = queryset.filter(academic_unit__in=self.scope)

        # annotate latest action
        latest_action = RequestAction.objects.filter(
            request=OuterRef("pk")
        ).order_by("-created_at")

        queryset = queryset.annotate(
            last_action=Subquery(latest_action.values("type")[:1])
        )

        return super().paginate_queryset(queryset, request, view)
    def get_paginated_response(self, data):
        current_year = now().year

        # 🔥 USE THE SAME QUERYSET AS PAGINATION RESULT
        qs = self.base_queryset

        latest_action = RequestAction.objects.filter(
            request=OuterRef("pk")
        ).order_by("-created_at")

        qs = qs.annotate(
            last_action=Subquery(latest_action.values("type")[:1])
        )

        stats = qs.aggregate(
            total_requests=Count("id"),

            created_requests=Count(
                "id",
                filter=Q(last_action="created")
            ),

            assigned_requests=Count(
                "id",
                filter=Q(last_action="assigned")
            ),

            completed_requests=Count(
                "id",
                filter=Q(last_action="completed")
            ),
        )

        response = {}

        if self.scope:
            response["scope"] = {
                "academic_units": [
                    {"id": u.id, "name": u.name}
                    for u in self.scope
                ]
            }

        response.update({
            "stats": stats,

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