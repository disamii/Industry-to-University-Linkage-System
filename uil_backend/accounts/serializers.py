from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework import serializers
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from collections import defaultdict

from organizational_structure.serializers import OrganizationStructureListSerializer
from organizational_structure.models import OrganizationalUnit
from authorization.models import RolePermission
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# serializers.py
from rest_framework import serializers
from .models import User
# from research_paper.models import ResearcherProfile


class UserFullSerializer(serializers.ModelSerializer):
    from organizational_structure.serializers import OrganizationStructureDetailSerializer
    academic_unit = OrganizationStructureDetailSerializer(read_only=True)

    class Meta:
        model = User
        exclude = [
            "groups",
            "user_permissions",
            "is_superuser",
        ]



class UserSerializer(serializers.ModelSerializer):
    has_profile = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()
    academic_unit_response = OrganizationStructureListSerializer(source='academic_unit', read_only=True)
    roles = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'father_name',  'grand_father_name', 'email','academic_unit','academic_unit_response','created_at', 'updated_at', 'must_change_password',  'is_superuser', 'status', 'has_profile', 'profile_picture','roles','permissions']
        read_only_fields = ('is_superuser','status')

    def validate_academic_unit(self, value: OrganizationalUnit):
        if value is None:
            raise serializers.ValidationError(
                "Academic unit is required."
            )

        if not value.is_leaf():
            raise serializers.ValidationError(
                "You must select the final (leaf) academic unit."
            )

        return value
    def get_has_profile(self, obj):
        return hasattr(obj, 'researcherprofile')
    
    def get_profile_picture(self, obj):
        profile = getattr(obj, 'researcherprofile', None)
        if profile and profile.profile_picture:
            return profile.profile_picture.url
        return None


    def get_profile_picture(self, obj):
        profile = getattr(obj, 'researcherprofile', None)
        if profile and profile.profile_picture:
            return profile.profile_picture.url
        return None
        
    def get_roles(self, obj):
        if obj.is_superuser:
            return ["Super Admin"]
        

        return list(
            obj.user_roles
            .select_related('role')
            .values_list('role__name', flat=True)
            .distinct()
        )
    def get_permissions(self, obj):
        from authorization.models import Permission, RolePermission 
        if obj.is_superuser:
            all_perms = list(Permission.objects.values_list('code', flat=True).distinct())
            all_perms.append("super_admin")  
            return all_perms

        return list(
            RolePermission.objects
                .filter(role__role_users__user=obj)
                .values_list('permission__code', flat=True)
                .distinct()
        )

class UploadUsersExcelSerializer(serializers.Serializer):
    file = serializers.FileField()
    academic_unit = serializers.PrimaryKeyRelatedField(
        queryset=OrganizationalUnit.objects.all()
    )


class BulkUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name','father_name', 'grand_father_name', 'email']
        extra_kwargs = {
            'username': {'required': False},
            'grand_father_name': {'required': False, 'allow_blank': True, 'allow_null': True},
        }

    def validate(self, data):
        if not data.get('username'):
            data['username'] = data['email'].split('@')[0]
        return data

    @staticmethod
    def validate_bulk(data_list):
        seen = set()
        duplicate_rows = []
        email_counts = defaultdict(int)
        for index, user in enumerate(data_list):
            email = (user.get('email') or '').strip().lower()
            key = email
            if key in seen:
                duplicate_rows.append(index + 1)
            seen.add(key)
            email_counts[email] += 1
        repeated_emails = [email for email,count in email_counts.items() if count > 1]
        if repeated_emails:
            raise ValidationError({
                "email": f"Duplicate email(s) found in upload: {', '.join(repeated_emails)}"
            })
        if duplicate_rows:
            raise ValidationError({
                "duplicate": f"Duplicate user(s) found at row(s): {', '.join(map(str, duplicate_rows))}"
            })

    def create(self, validated_data):
        validated_data['status'] = 'APPROVED'
        return User.objects.create(**validated_data)


class UserForChatSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'father_name', 'grand_father_name',
                  'email', 'created_at', 'updated_at',  'is_superuser', 'status']


class FirstTimeChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = self.context["request"].user

        if not user.check_password(attrs["current_password"]):
            raise serializers.ValidationError(
                {"current_password": "Incorrect password."})

        try:
            validate_password(attrs["new_password"], user)
        except Exception as e:
            raise serializers.ValidationError(
                {"new_password": e.messages if hasattr(e, 'messages') else [str(e)]})

        return attrs


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'father_name',
                   'grand_father_name', 'email', 'password','academic_unit']
        read_only_fields = ['id']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.password = make_password(password)
        user.save()
        return user
    def validate_academic_unit(self, value: OrganizationalUnit):
        if value is None:
            raise serializers.ValidationError(
                "Academic unit is required."
            )

        if not value.is_leaf():
            raise serializers.ValidationError(
                "You Must Select the Last Academic Unit."
            )

        return value

class UserDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id']




class DashboardSummarySerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    pending_users = serializers.IntegerField()
    approved_users = serializers.IntegerField()
    rejected_users = serializers.IntegerField()
    active_users = serializers.IntegerField()
    inactive_users = serializers.IntegerField()
    superusers = serializers.IntegerField()
    users_created_today = serializers.IntegerField()
    users_created_this_week = serializers.IntegerField()
    users_created_this_month = serializers.IntegerField()




class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    from django.contrib.auth import authenticate, get_user_model

    username_field = get_user_model().USERNAME_FIELD  # typically "username"

    def validate(self, attrs):
        from django.contrib.auth import authenticate, get_user_model

        user_input = attrs.get("username")  # user can type username or email
        password = attrs.get("password")

        user_model = get_user_model()
        try:
            # Check if input is an email
            if "@" in user_input:
                user_obj = user_model.objects.get(email__iexact=user_input)
                username = user_obj.get_username()
            else:
                username = user_input
        except user_model.DoesNotExist:
            raise serializers.ValidationError("No user found with this email/username.")

        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Incorrect credentials.")

        # Call original validation to get tokens
        data = super().validate({"username": username, "password": password})
        return data