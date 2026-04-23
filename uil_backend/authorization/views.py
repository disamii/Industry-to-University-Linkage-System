# authorization/views.py
from rest_framework import generics,viewsets
from .permissions import IsSuperAdmin
from .models import Role, Permission, RolePermission, UserRole
from .serializers import RoleDetailSerializer,  RoleSerializer, PermissionSerializer, UserRoleGroupedSerializer, UserRoleModelSerializer, RolePermissionSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsSuperAdmin]

    def get_serializer_class(self):
        if self.action in ['retrieve']:
            return RoleDetailSerializer
        return RoleSerializer

    
    def get_permissions(self):
        if self.action not in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsSuperAdmin]
        return [permission() for permission in permission_classes]
        

class PermissionListView(generics.ListAPIView):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [IsSuperAdmin]

class RolePermissionView(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request):
        serializer = RolePermissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        role = serializer.validated_data["role"]
        permissions = serializer.validated_data["permissions"]

        RolePermission.objects.filter(role=role).exclude(permission__in=permissions).delete()

        RolePermission.objects.bulk_create(
            [RolePermission(role=role, permission=p) for p in permissions],
            ignore_conflicts=True
        )

        return Response(
            {"detail": "Permissions updated"},
            status=status.HTTP_201_CREATED
        )
    def delete(self, request):
        serializer = RolePermissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        role = serializer.validated_data["role"]
        permissions = serializer.validated_data["permissions"]

        deleted, _ = RolePermission.objects.filter(
            role=role,
            permission__in=permissions
        ).delete()

        return Response(
            {"detail": f"{deleted} permission(s) removed"},
            status=status.HTTP_200_OK
        )


class UserRoleViewSet(viewsets.ModelViewSet):
    queryset = UserRole.objects.select_related(
        "user",
        "role",
        "organizational_unit"
    )
    serializer_class = UserRoleModelSerializer
    
    def get_permissions(self):
        if self.action not in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsSuperAdmin]
        return [permission() for permission in permission_classes]
    
    def list(self, request, *args, **kwargs):
        user_roles = self.get_queryset()

        grouped = {}

        for ur in user_roles:
            uid = ur.user.id

            if uid not in grouped:
                grouped[uid] = {
                    "user": ur.user,
                    "role_units": [],
                }

            grouped[uid]["role_units"].append({
                "id": ur.id,  # UserRole table id
                "role": ur.role,
                "organizational_unit": ur.organizational_unit,
            })

        data = [
            {
                "user": item["user"],
                "role_units": item["role_units"],
            }
            for item in grouped.values()
        ]

        serializer = UserRoleGroupedSerializer(data, many=True)
        return Response(serializer.data)
