# authorization/serializers.py
from django.contrib.auth import get_user_model
from rest_framework import serializers
from organizational_structure.serializers import OrganizationStructurdeForProfileSerializer
from accounts.serializers import UserSerializer
from organizational_structure.models import OrganizationalUnit
from .models import Role, Permission, UserRole


User = get_user_model()

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['code','description']

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id','name','description']

class RoleDetailSerializer(serializers.ModelSerializer):
    permissions = serializers.SerializerMethodField()
    class Meta:
        model = Role
        fields = ['id','name','description','permissions']

    def get_permissions(self, obj):
        return [
            {"id":rp.permission.id,"code": rp.permission.code, "description": rp.permission.description}
            for rp in obj.role_permissions.all()
        ]


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'

class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = '__all__'

class RolePermissionSerializer(serializers.Serializer):
    role_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(),
        source="role"
    )
    permission_ids = serializers.PrimaryKeyRelatedField(
        queryset=Permission.objects.all(),
        many=True,
        source="permissions"
    )


class UserRoleUnitSerializer(serializers.ModelSerializer):
    role = RoleDetailSerializer(read_only=True)
    organizational_unit = OrganizationStructurdeForProfileSerializer(
        read_only=True
    )

    class Meta:
        model = UserRole
        fields = ("id", "role", "organizational_unit")


class UserRoleGroupedSerializer(serializers.Serializer):
    user = UserSerializer()
    role_units = UserRoleUnitSerializer(many=True)
class UserRoleModelDetailSerializer(serializers.ModelSerializer):
    role=RoleDetailSerializer()
    user=UserSerializer()
    organizational_unit=OrganizationStructurdeForProfileSerializer()
    class Meta:
        model = UserRole
        fields = ["id", "user", "role", "organizational_unit"]


class UserRoleModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ["id", "user", "role", "organizational_unit"]        