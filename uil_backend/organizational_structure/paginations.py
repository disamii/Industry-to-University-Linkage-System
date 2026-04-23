from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class DefaultPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'

    def get_paginated_response(self, data, model=None):
        """
        Build custom paginated response.
        :param data: serialized page results
        :param model: optional Django model class to count global rows
        """
        total_global = None
        if model:
            total_global = model.objects.count()

        return Response({
            "counts": {
                "total": total_global if total_global is not None else self.page.paginator.count,
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
