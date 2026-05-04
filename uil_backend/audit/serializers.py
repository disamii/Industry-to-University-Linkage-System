# audit/serializers.py

from collections import defaultdict
from rest_framework import serializers
from .models import ActivityLog


class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = [
            "id",
            "actor",
            "action_type",
            "content_type",
            "object_id",
            "message",
            "metadata",
            "created_at",
        ]


class GroupedActivityLogSerializer(serializers.Serializer):
    def to_representation(self, instance):
        grouped = defaultdict(list)

        for log in instance:
            grouped[log.content_type].append(
                ActivityLogSerializer(log).data
            )

        return grouped