from rest_framework.parsers import FormParser, MultiPartParser
from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import  NotFound, ValidationError, NotAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status, mixins
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated, AllowAny
from config.paginations import DefaultPagination
from .models import Industry, Request,Assignment
from .permissions import REQUEST_REQUIRED_PERMISSIONS, INDUSTRY_REQUIRED_PERMISSIONS
from authorization.permissions import HasRequiredPermissions, IsOwnerOrHasRequiredPermissions
from organizational_structure.models import OrganizationalUnit
from authorization.utilis import get_scope, is_unit_in_user_scope
from .serializers import (
    IndustryCreateSerializer,
    ACTION_SERIALIZERS,
    RequestDetailSerializer,
    IndustrySerializer,
    RequestSerializer,
    RequestCreateSerializer,
    AssignmentDetailSerializer,
    AssignmentListSerializer
    )


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


class RequestViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    filterset_fields = ['type', 'actions__type','requesting_entity', 'academic_unit', 'industry']
    ordering_fields = ['created_at','updated_at','title', 'industry__name', 'requesting_entity']
    search_fields = ['industry__name']
    parser_classes = [MultiPartParser, FormParser]
    pagination_class = DefaultPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    queryset = Request.objects.select_related("academic_unit").prefetch_related("actions")
    
    def get_permissions(self):
        """setting permission according to the  action and also adding permission class depending on action"""
        self.required_permissions = REQUEST_REQUIRED_PERMISSIONS.get(
            self.action, [])
        if self.action in ("update", "partial_update", "destroy", "create", 'retrieve'):
            permission_classes = [IsAuthenticated,IsOwnerOrHasRequiredPermissions]
        else:
            permission_classes = [HasRequiredPermissions]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == "create":
            return RequestCreateSerializer
        elif self.action == "retrieve":
            return RequestDetailSerializer
        return RequestSerializer

    def get_object(self):
        """it pass the scope of the target to the class and check object permission"""
        obj = super().get_object()
        self.target_scope = obj.academic_unit
        self.check_object_permissions(self.request, obj)
        return obj

    @action(detail=False, methods=['get'], url_path='my-requests')
    def my_requests(self, request):
        try:
            industry = request.user.industry_profile
        except (Industry.DoesNotExist, AttributeError):
            raise NotFound("Industry profile not found")
        qs = self.get_queryset().filter(industry=industry).select_related("industry")
        qs = self.filter_queryset(qs)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class RequestManageViewSet(
        mixins.ListModelMixin,
        mixins.RetrieveModelMixin,
        mixins.DestroyModelMixin,
        viewsets.GenericViewSet):
    filterset_fields = ['type', 'actions__type']
    ordering_fields = ['created_at', 'updated_at', 'title', 'industry__name']
    search_fields = ['industry__name']
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    queryset = Request.objects.all()
    pagination_class = DefaultPagination

    def get_permissions(self):
        """setting permission according to the  action and also adding permission class depending on action"""
        self.required_permissions = REQUEST_REQUIRED_PERMISSIONS.get(
            self.action, [])
        if self.action in ("destroy",  'retrieve'):
            permission_classes = [IsAuthenticated,
                                  IsOwnerOrHasRequiredPermissions]
        else:
            permission_classes = [HasRequiredPermissions]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return RequestDetailSerializer
        return RequestSerializer

    def get_object(self):
        """it pass the scope of the target to the class and check object permission"""
        obj = super().get_object()
        self.target_scope = obj.academic_unit
        self.check_object_permissions(self.request, obj)
        return obj

    def get_queryset(self):
        """enbales the list to be returned by the  scope of administatror"""
        user = self.request.user
        if not user.is_authenticated:
            raise NotAuthenticated(
                "Authentication credentials were not provided")

        scope = get_scope(user, self.required_permissions)
        parent_unit_id = self.request.query_params.get("academic_unit_scope")
        if parent_unit_id:
            try:
                parent_unit = OrganizationalUnit.objects.get(
                    id=int(parent_unit_id))
            except OrganizationalUnit.DoesNotExist:
                return Request.objects.none()
            if not parent_unit in scope:
                return Request.objects.none()
            self.request.parent_scope = parent_unit

            filter_scope = [parent_unit.id] + \
                [u.id for u in parent_unit.get_all_descendants()]
            scope_qs = OrganizationalUnit.objects.filter(id__in=filter_scope)
        else:
            scope_qs = scope

        queryset = Request.objects.filter(
            academic_unit__in=scope_qs
        ).order_by('-created_at')
        return queryset

    @action(detail=True, methods=["post"], url_path="actions")
    def create_action(self, request, pk=None):

        request_obj = self.get_object()
        action_type = request.data.get("type")

        serializer_class = ACTION_SERIALIZERS.get(action_type)

        if not serializer_class:
            raise ValidationError({"type": "Invalid action type"})
        serializer = serializer_class(
            data=request.data,
            context={
                "request": request,
                "request_obj": request_obj
            }
        )

        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            action = serializer.save(
                request=request_obj,
            )

        return Response(
            {
                "id": action.id,
                "type": action.type,
                "message": "Action applied successfully"
            },
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['get'], url_path='by-industry/(?P<industry_id>[^/.]+)')
    def by_industry(self, request, industry_id=None):
        qs = self.get_queryset()

        qs = qs.filter(
            industry_id=industry_id
        ).select_related("industry")
        if not qs.exists():
            raise NotFound("No requests found for this industry")

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = RequestSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = RequestSerializer(qs, many=True)
        return Response(serializer.data)


class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.select_related("request", "assigned_user")
    serializer_class = AssignmentDetailSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['status']
    ordering_fields = ['start_date', 'end_date']
    pagination_class = DefaultPagination
    # -----------------------------
    # SERIALIZER SWITCH
    # -----------------------------
    def get_serializer_class(self):
        if self.action == "list":
            return AssignmentListSerializer
        return AssignmentDetailSerializer

    # -----------------------------
    # BY USER
    # /assignments/by-user/{user_id}/
    # -----------------------------
    @action(detail=False, methods=["get"], url_path="by-user/(?P<user_id>[^/.]+)")
    def by_user(self, request, user_id=None):
        qs = self.queryset.filter(assigned_user_id=user_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    # -----------------------------
    # BY REQUEST (REQUIREMENT)
    # /assignments/by-request/{request_id}/
    # -----------------------------
    @action(detail=False, methods=["get"], url_path="by-request/(?P<request_id>[^/.]+)")
    def by_request(self, request, request_id=None):
        qs = self.queryset.filter(request_id=request_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    # -----------------------------
    # BY INDUSTRY
    # (assuming request has industry FK)
    # /assignments/by-industry/{industry_id}/
    # -----------------------------
    @action(detail=False, methods=["get"], url_path="by-industry/(?P<industry_id>[^/.]+)")
    def by_industry(self, request, industry_id=None):
        qs = self.queryset.filter(request__industry_id=industry_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)