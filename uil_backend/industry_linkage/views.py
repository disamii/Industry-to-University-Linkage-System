from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated,AllowAny
from config.paginations import DefaultPagination
from .models import Industry, IndustryRequest
from .permissions import INDUSTRY_REQUEST_REQUIRED_PERMISSIONS,INDUSTRY_REQUIRED_PERMISSIONS
from organizational_structure.models import OrganizationalUnit
from .serializers import IndustryCreateSerializer, IndustryRequestDetailSerializer,IndustrySerializer,IndustryRequestSerializer,IndustryRequestCreateSerializer
from authorization.permissions import HasRequiredPermissions,IsOwnerOrHasRequiredPermissions

class IndustryViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['industry_type']
    ordering_fields = ['created_at', 'updated_at','name']
    search_fields = ['name']
    queryset = Industry.objects.select_related("contact_person").all()
    pagination_class = DefaultPagination

    def get_serializer_class(self):
        if self.action == "create":
            return IndustryCreateSerializer
        return IndustrySerializer
    
    def get_permissions(self):
        """setting permission according to the  action and also adding permission class depending on action"""
        self.required_permissions = INDUSTRY_REQUIRED_PERMISSIONS.get(self.action, [])
        if self.action in  ("create"):
            permission_classes = [AllowAny]
            
        elif self.action in ("update", "partial_update","destroy"):
            permission_classes = [IsAuthenticated, IsOwnerOrHasRequiredPermissions]
        else:
            permission_classes = [HasRequiredPermissions]
        return [permission() for permission in permission_classes]

class IndustryRequestViewSet(viewsets.ModelViewSet):
    filterset_fields = ['type','actions__type']
    ordering_fields = ['created_at', 'updated_at','title','industry__name']
    search_fields = ['industry__name']
    queryset = IndustryRequest.objects.all()
    pagination_class = DefaultPagination


    def perform_create(self, serializer):
        serializer.save()
    
    def get_permissions(self):
        """setting permission according to the  action and also adding permission class depending on action"""
        self.required_permissions = INDUSTRY_REQUEST_REQUIRED_PERMISSIONS.get(self.action, [])
        if self.action in ("update", "partial_update","destroy","create"):
            permission_classes = [IsAuthenticated, IsOwnerOrHasRequiredPermissions]
        else:
            permission_classes = [HasRequiredPermissions]
        return [permission() for permission in permission_classes]
    def get_serializer_class(self):
        if self.action == "create":
            return IndustryRequestCreateSerializer
        elif self.action=="retrieve":
            return IndustryRequestDetailSerializer
        
        return IndustryRequestSerializer
    