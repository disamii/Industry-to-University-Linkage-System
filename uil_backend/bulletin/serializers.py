
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
            "expires_at",
            "related_model",
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
            "description",
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
        if obj.related_object:
            return {
                "id": obj.object_id,
                "type": obj.content_type.model if obj.content_type else None,
                "repr": str(obj.related_object),
            }
        return None