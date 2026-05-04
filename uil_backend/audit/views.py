# audit/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count
from .models import ActivityLog
from .serializers import GroupedActivityLogSerializer


class AdminDashboardView(APIView):

    def get(self, request):
        recent_logs = ActivityLog.objects.select_related("actor")[:20]

        metrics = {
            "total_logs": ActivityLog.objects.count(),
            "creates": ActivityLog.objects.filter(action_type="create").count(),
            "updates": ActivityLog.objects.filter(action_type="update").count(),
            "status_changes": ActivityLog.objects.filter(action_type="status_change").count(),
        }

        grouped_logs = GroupedActivityLogSerializer(recent_logs).data

        return Response({
            "recent_activity": grouped_logs,
            "metrics": metrics
        })