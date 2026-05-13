from rest_framework.parsers import FormParser, MultiPartParser, JSONParser
from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import NotFound, ValidationError, NotAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status, mixins
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated, AllowAny
from config.paginations import DefaultPagination
from authorization.constants import CAN_READ_REQUEST_LIST
from .enums import ActionTypes, AssignmentStatus, RequestDirection, RequestingEntity
from .models import Industry, Request, Assignment, RequestAction
from .permissions import REQUEST_REQUIRED_PERMISSIONS, INDUSTRY_REQUIRED_PERMISSIONS
from authorization.permissions import HasRequiredPermissions, IsOwnerOrHasRequiredPermissions
from organizational_structure.models import OrganizationalUnit
from authorization.utilis import get_scope
from .serializers import (
    IndustryCreateSerializer,
    ACTION_SERIALIZERS,
    IndustryDetailSerializer,
    RequestDetailSerializer,
    IndustrySerializer,
    RequestSerializer,
    RequestCreateSerializer,
    AssignmentDetailSerializer,
    AssignmentListSerializer
)
from .utils import revert_action_util, validate_action_or_raise, deactivate_previous_actions
from .paginations import AssignmentPagination, IndustryPagination, RequestPagination, RequestForIndustryPagination
from django.contrib.auth import get_user_model


class IndustryViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['industry_type']
    ordering_fields = ['created_at', 'updated_at', 'name']
    search_fields = ['name']
    queryset = Industry.objects.select_related("contact_person").all()
    pagination_class = IndustryPagination

    def get_serializer_class(self):
        if self.action == "create":
            return IndustryCreateSerializer
        elif self.action == "retrieve":
            return IndustryDetailSerializer
        return IndustrySerializer

    def get_permissions(self):
        """setting permission according to the  action and also adding permission class depending on action"""
        self.required_permissions = INDUSTRY_REQUIRED_PERMISSIONS.get(
            self.action, [])
        if self.action in ["create"]:
            permission_classes = [AllowAny]
        elif self.action in ["update", "partial_update", "retrieve", "destroy"]:
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
    filterset_fields = ['type', 'actions__type',
                        'requesting_entity', 'academic_unit', 'industry']
    ordering_fields = ['created_at', 'updated_at',
                       'title', 'industry__name', 'requesting_entity']
    search_fields = ['industry__name', "title"]
    parser_classes = [MultiPartParser, FormParser]
    pagination_class = RequestForIndustryPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    queryset = Request.objects.select_related(
        "academic_unit").prefetch_related("actions")

    def get_permissions(self):
        """setting permission according to the  action and also adding permission class depending on action"""
        self.required_permissions = REQUEST_REQUIRED_PERMISSIONS.get(
            self.action, [])
        if self.action in ("update", "partial_update", "destroy", "create", 'retrieve'):
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [HasRequiredPermissions]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action in ["create", "partial_update", "patch"]:
            return RequestCreateSerializer
        elif self.action == "retrieve":
            return RequestDetailSerializer
        return RequestSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["user"] = self.request.user
        return context

    def get_object(self):
        """it pass the scope of the target to the class and check object permission"""
        obj = super().get_object()
        self.target_scope = obj.academic_unit
        self.check_object_permissions(self.request, obj)
        return obj

    @action(detail=False, methods=["get"], url_path="my-requests")
    def my_requests(self, request):

        direction = request.query_params.get("direction")
        entity = request.query_params.get("entity")

        valid_directions = RequestDirection.values
        valid_entities = RequestingEntity.values

        if direction not in valid_directions:
            return Response(
                {"detail": "direction must be incoming or outgoing"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if entity not in valid_entities:
            return Response(
                {"detail": "invalid entity"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        qs = self.get_queryset()

        if entity == RequestingEntity.INDUSTRY:

            try:
                industry = request.user.industry_profile

                if direction == RequestDirection.INCOMING:
                    qs = qs.filter(
                        industry=industry
                    ).exclude(
                        requesting_entity=RequestingEntity.INDUSTRY
                    )

                elif direction == RequestDirection.OUTGOING:
                    qs = qs.filter(
                        industry=industry,
                        requesting_entity=RequestingEntity.INDUSTRY,
                    )

            except (Industry.DoesNotExist, AttributeError):
                raise NotFound("Industry profile not found")

        elif entity == RequestingEntity.ACADEMIC_UNIT:

            scope = get_scope(request.user, CAN_READ_REQUEST_LIST)

            if direction == RequestDirection.INCOMING:
                qs = qs.filter(
                    academic_unit__in=scope
                ).exclude(
                    requesting_entity=RequestingEntity.ACADEMIC_UNIT
                )

            elif direction == RequestDirection.OUTGOING:
                qs = qs.filter(
                    academic_unit__in=scope,
                    requesting_entity=RequestingEntity.ACADEMIC_UNIT,
                )

        elif entity == RequestingEntity.STAFF:

            qs = qs.filter(
                requested_by=request.user,
                requesting_entity=RequestingEntity.STAFF,
            )

        elif entity == RequestingEntity.STUDENT:

            qs = qs.filter(
                requested_by=request.user,
                requesting_entity=RequestingEntity.STUDENT,
            )

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
    filterset_fields = ['type', 'actions__type',
                        'requesting_entity', 'academic_unit', 'industry']
    ordering_fields = ['created_at', 'updated_at', 'title', 'industry__name']
    search_fields = ['industry__name', 'title']
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    queryset = Request.objects.all().order_by('created_at')
    pagination_class = RequestPagination

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

    @action(detail=True, methods=["post"], url_path="actions",
            parser_classes=[JSONParser, MultiPartParser, FormParser]
            )
    def create_action(self, request, pk=None):

        request_obj = self.get_object()
        action_type = request.data.get("type")
        validate_action_or_raise(request_obj, action_type)
        serializer_class = ACTION_SERIALIZERS.get(action_type)

        if not serializer_class:
            raise ValidationError("Invalid action type")
        serializer = serializer_class(
            data=request.data,
            context={
                "request": request,
                "request_obj": request_obj
            }
        )

        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            deactivate_previous_actions(request_obj, action_type)
            action = serializer.save(request=request_obj)

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

    @action(
        detail=False,
        methods=["post"],
        url_path="actions/(?P<action_id>[^/.]+)/alter_action"
    )
    def alter_action(self, request, action_id=None):

        try:
            action = RequestAction.objects.get(id=action_id)
        except RequestAction.DoesNotExist:
            return Response(
                {"detail": "Action not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        if action.type == ActionTypes.REVERTED:
            return Response(
                {"detail": "Action is already reverted"},
                status=status.HTTP_400_BAD_REQUEST
            )

        description = request.data.get("description", "").strip()

        if not description:
            return Response(
                {"description": "This field is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            action = revert_action_util(action, note=description)

        return Response(
            {
                "id": action.id,
                "type": action.type,
                "awaiting_decision": action.awaiting_decision,
                "message": "Action reverted successfully"
            },
            status=status.HTTP_200_OK
        )


class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.select_related(
        "request").prefetch_related("assigned_users")
    serializer_class = AssignmentDetailSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['status']
    ordering_fields = ['start_date', 'end_date']
    pagination_class = AssignmentPagination
    search_fields = ['request__industry__name', 'request__title']

    def get_serializer_class(self):
        if self.action == "list":
            return AssignmentListSerializer
        return AssignmentDetailSerializer

    @action(detail=False, methods=["get"], url_path="by-user/(?P<user_id>[^/.]+)")
    def by_user(self, request, user_id=None):
        qs = self.queryset.filter(assigned_users__id=user_id).distinct()

        qs = self.filter_queryset(qs)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="by-request/(?P<request_id>[^/.]+)")
    def by_request(self, request, request_id=None):
        qs = self.queryset.filter(request_id=request_id)

        qs = self.filter_queryset(qs)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="by-industry/(?P<industry_id>[^/.]+)")
    def by_industry(self, request, industry_id=None):
        qs = self.queryset.filter(request__industry_id=industry_id)

        qs = self.filter_queryset(qs)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["patch"], url_path="remove-users")
    def remove_users(self, request, pk=None):

        assignment = self.get_object()

        user_ids = request.data.get("user_ids", [])

        if not isinstance(user_ids, list) or not user_ids:
            raise ValidationError({
                "user_ids": "Provide a non-empty list of user ids."
            })

        pi_member = assignment.members.filter(
            is_pi=True
        ).first()

        if pi_member and pi_member.user_id in user_ids:
            raise ValidationError({
                "user_ids": (
                    "PI cannot be removed from assignment."
                )
            })

        current_users_count = assignment.members.count()

        users_to_remove_count = assignment.members.filter(
            user_id__in=user_ids,
            is_pi=False
        ).count()

        remaining_users = current_users_count - users_to_remove_count

        if remaining_users < 1:
            raise ValidationError({
                "assigned_users": (
                    "Assignment must have at least one member."
                )
            })

        assignment.members.filter(
            user_id__in=user_ids,
            is_pi=False
        ).delete()

        return Response({
            "detail": "Users removed successfully."
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=["patch"], url_path="add-users")
    def add_users(self, request, pk=None):
        assignment = self.get_object()

        user_ids = request.data.get("user_ids", [])

        if not isinstance(user_ids, list) or not user_ids:
            raise ValidationError({
                "user_ids": "Provide a non-empty list of user ids."
            })

        User = get_user_model()
        users = User.objects.filter(id__in=user_ids)

        if users.count() != len(user_ids):
            raise ValidationError({
                "user_ids": "One or more users do not exist."
            })

        assignment.assigned_users.add(*users)

        return Response({
            "detail": "Users added successfully."
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=["patch"], url_path="change-status")
    def change_status(self, request, pk=None):
        assignment = self.get_object()
        is_pi = assignment.members.filter(
            user=request.user,
            is_pi=True
        ).exists()

        if not is_pi:
            raise PermissionDenied(
                "Only the PI can change the assignment status."
            )

        new_status = request.data.get("status")

        valid_statuses = [
            choice[0]
            for choice in AssignmentStatus.choices
        ]

        if not new_status:
            raise ValidationError({
                "status": "This field is required."
            })

        if new_status not in valid_statuses:
            raise ValidationError({
                "status": f"Invalid status. Allowed values: {valid_statuses}"
            })

        assignment.status = new_status
        assignment.save(update_fields=["status"])

        return Response({
            "detail": "Assignment status updated successfully.",
            "status": assignment.status
        }, status=status.HTTP_200_OK)
