from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from .enums import PostType

class AssignmentPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"

    def paginate_queryset(self, queryset, request, view=None):
        self.base_queryset = queryset
        return super().paginate_queryset(queryset, request, view)

    def get_paginated_response(self, data):
        qs = self.base_queryset

        # Base stats
        stats = {
            "total_posts": qs.count()
        }

        # Dynamic enum-based stats
        for status_value, _label in PostType.choices:
            key = f"{status_value}"
            stats[key] = qs.filter(status=status_value).count()

        response = {
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
        }

        return Response(response)