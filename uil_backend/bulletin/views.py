from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter

from .models import Post
from .serializers import PostListSerializer, PostDetailSerializer
from .filters import PostFilter
from config.paginations import DefaultPagination


class PostViewSet(viewsets.ModelViewSet):

    queryset = Post.objects.all()
    pagination_class = DefaultPagination

    filter_backends = [
        DjangoFilterBackend,
        OrderingFilter,
        SearchFilter,
    ]

    filterset_class = PostFilter

    search_fields = [
        "title",
        "description",
        "content",
    ]

    ordering_fields = [
        "created_at",
        "updated_at",
        "published_at",
        "title",
    ]

    ordering = ["-published_at"]

    def get_serializer_class(self):
        if self.action == "list":
            return PostListSerializer
        return PostDetailSerializer
