
from rest_framework import serializers

from industry_linkage.serializers import RequestSerializer
from .models import Post


class PostListSerializer(serializers.ModelSerializer):
    related_model = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "post_type",
            "is_published",
            "is_internal_only",
            "published_at",
            "expires_at"
            ]

    def get_related_model(self, obj):
        if obj.related_object:
            return str(obj.related_object)
        return None
class PostDetailSerializer(serializers.ModelSerializer):
    related_object = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "post_type",
            "content",
            "is_internal_only",
            "is_published",
            "published_at",
            "expires_at",
            "image",
            "related_object",
            "created_at",
            "updated_at",
        ]


from rest_framework import serializers
from .models import Post


class PostListSerializer(serializers.ModelSerializer):
    related_model = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "post_type",
            "is_published",
            "is_internal_only",
            "published_at",
            "expires_at"
            ]

    def get_related_model(self, obj):
        if obj.related_object:
            return str(obj.related_object)
        return None
class PostDetailSerializer(serializers.ModelSerializer):
    related_object = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "post_type",
            "content",
            "is_internal_only",
            "is_published",
            "published_at",
            "expires_at",
            "image",
            "related_object",
            "created_at",
            "updated_at",
        ]
    def get_related_object(self, obj):
        if not obj.related_object:
            return None

        serializer_map = {
            "request": RequestSerializer,
        }

        model_name = obj.content_type.model
        serializer_class = serializer_map.get(model_name)

        if not serializer_class:
            return None

        return serializer_class(obj.related_object).data