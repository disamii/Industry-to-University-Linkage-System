import django_filters
from .models import Post


class PostFilter(django_filters.FilterSet):
    published_from = django_filters.DateTimeFilter(field_name="published_at", lookup_expr="gte")
    published_to = django_filters.DateTimeFilter(field_name="published_at", lookup_expr="lte")

    expires_after = django_filters.DateTimeFilter(field_name="expires_at", lookup_expr="gte")
    expires_before = django_filters.DateTimeFilter(field_name="expires_at", lookup_expr="lte")

    class Meta:
        model = Post
        fields = {
            "post_type": ["exact"],
            "is_published": ["exact"],
            "is_internal_only": ["exact"],
            "content_type": ["exact"],
        }