from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import (
    RoleViewSet,
    PermissionListView, UserRoleViewSet, RolePermissionView
)

router=DefaultRouter()
router.register(r"roles",RoleViewSet)
router.register("user-roles", UserRoleViewSet),



urlpatterns = router.urls+[
    path('permissions/', PermissionListView.as_view(), name='permission-list'),
    path('role-permissions/', RolePermissionView.as_view(), name='rolepermission-list')
]
