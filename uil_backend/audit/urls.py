from django.urls import path
from .views import AdminDashboardView

urlpatterns = [
    path("industry_linkage/", AdminDashboardView.as_view(), name="admin-dashboard"),
]