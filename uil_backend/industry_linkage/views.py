from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated, AllowAny
from config.paginations import DefaultPagination
from .models import Industry, IndustryRequest
from .permissions import INDUSTRY_REQUEST_REQUIRED_PERMISSIONS, INDUSTRY_REQUIRED_PERMISSIONS
from organizational_structure.models import OrganizationalUnit
from .serializers import IndustryCreateSerializer, IndustryRequestDetailSerializer, IndustrySerializer, IndustryRequestSerializer, IndustryRequestCreateSerializer
from authorization.permissions import HasRequiredPermissions, IsOwnerOrHasRequiredPermissions
from rest_framework.exceptions import NotFound
from rest_framework.decorators import action
from rest_framework.response import Response


class IndustryViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['industry_type']
    ordering_fields = ['created_at', 'updated_at', 'name']
    search_fields = ['name']
    queryset = Industry.objects.select_related("contact_person").all()
    pagination_class = DefaultPagination

    def get_serializer_class(self):
        if self.action == "create":
            return IndustryCreateSerializer
        return IndustrySerializer

    def get_permissions(self):
        """setting permission according to the  action and also adding permission class depending on action"""
        self.required_permissions = INDUSTRY_REQUIRED_PERMISSIONS.get(
            self.action, [])
        if self.action in ("create"):
            permission_classes = [AllowAny]

        elif self.action in ("update", "partial_update", "destroy"):
            permission_classes = [IsAuthenticated,
                                  IsOwnerOrHasRequiredPermissions]
        else:
            permission_classes = [HasRequiredPermissions]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        try:
            industry = request.user.industry_profile
        except Industry.DoesNotExist:
            raise NotFound("Industry profile not found")

        serializer = IndustrySerializer(industry)
        return Response(serializer.data)


class IndustryRequestViewSet(viewsets.ModelViewSet):
    filterset_fields = ['type', 'actions__type']
    ordering_fields = ['created_at', 'updated_at', 'title', 'industry__name']
    search_fields = ['industry__name']
    queryset = IndustryRequest.objects.all()
    pagination_class = DefaultPagination

    def perform_create(self, serializer):
        serializer.save()

    def get_permissions(self):
        """setting permission according to the  action and also adding permission class depending on action"""
        self.required_permissions = INDUSTRY_REQUEST_REQUIRED_PERMISSIONS.get(
            self.action, [])
        if self.action in ("update", "partial_update", "destroy", "create", 'retrieve'):
            permission_classes = [IsAuthenticated,
                                  IsOwnerOrHasRequiredPermissions]
        else:
            permission_classes = [HasRequiredPermissions]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == "create":
            return IndustryRequestCreateSerializer
        elif self.action == "retrieve":
            print("am here doing what ")
            return IndustryRequestDetailSerializer
        return IndustryRequestSerializer

    @action(detail=False, methods=['get'], url_path='by-industry/(?P<industry_id>[^/.]+)')
    def by_industry(self, request, industry_id=None):
        qs = IndustryRequest.objects.filter(
            industry_id=industry_id).select_related("industry")

        if not qs.exists():
            raise NotFound("No requests found for this industry")

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = IndustryRequestSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = IndustryRequestSerializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='my-requests')
    def my_requests(self, request):
        try:
            industry = request.user.industry_profile
        except Industry.DoesNotExist:
            raise NotFound("Industry profile not found")

        qs = IndustryRequest.objects.filter(
            industry=industry).select_related("industry")

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = IndustryRequestSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = IndustryRequestSerializer(qs, many=True)
        return Response(serializer.data)
