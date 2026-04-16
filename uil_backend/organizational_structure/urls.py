from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from .views import OrganizationStructureScopeViewSet, OrganizationStructureViewSet

router = DefaultRouter()
router.register(r'organizational-unit', OrganizationStructureViewSet, basename='organizational-unit')
router.register(r'organizational-unit-scope', OrganizationStructureScopeViewSet, basename='organizational-unit-scope')
# router.register(r'unit-analytics', OrganizationalUnitAnalyticsViewSet, basename='unit-analytics')

urlpatterns = [

    path('', include(router.urls)),

]
