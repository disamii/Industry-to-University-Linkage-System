from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction

from django.contrib.auth.hashers import make_password
from .models import Industry,IndustryRequest,IndustryRequestAction
User = get_user_model()
class IndustryCreateSerializer(serializers.ModelSerializer):
    contact_full_name = serializers.CharField(write_only=True)
    contact_email = serializers.EmailField(write_only=True)
    contact_password = serializers.CharField(write_only=True)

    class Meta:
        model = Industry
        fields = [
            "id",
            "name",
            "industry_type",
            "industry_email",
            "phone_number",
            "location",
            "address",
            "description",
            "number_of_employees",
            "website",
            "contact_full_name",
            "contact_email",
            "contact_password",
            "contact_person_phone_number",
        ]
        read_only_fields = ["id"]

    def create(self, validated_data):
        from authorization.models import Role, UserRole

        full_name = validated_data.pop("contact_full_name")
        email = validated_data.pop("contact_email")
        password = validated_data.pop("contact_password")

        parts = full_name.strip().split()
        first_name = parts[0] if len(parts) > 0 else ""
        father_name = parts[1] if len(parts) > 1 else ""
        grand_father_name = parts[2] if len(parts) > 2 else ""

        industry_name = validated_data.get("name")
        username = f"{industry_name}_{first_name}".lower().replace(" ", "")

        user = User.objects.create(
            username=username,
            first_name=first_name,
            father_name=father_name,
            grand_father_name=grand_father_name,
            email=email,
            password=make_password(password),
        )

        industry = Industry.objects.create(
            contact_person=user,
            created_by=user,
            updated_by=user,
            **validated_data
        )

        role, _ = Role.objects.get_or_create(
            name="Industry",
            defaults={"description": "Industry role"}
        )

        UserRole.objects.create(
            user=user,
            role=role,
            organizational_unit=None
        )

        # attach for response
        self._created_user = user

        return industry

    def to_representation(self, instance):
        data = super().to_representation(instance)

        user = getattr(self, "_created_user", None)

        if user:
            data["contact_full_name"] = f"{user.first_name} {user.father_name} {user.grand_father_name}".strip()
            data["contact_email"] = user.email

        return data
class IndustrySerializer(serializers.ModelSerializer):
    contact_full_name = serializers.SerializerMethodField()
    contact_email = serializers.SerializerMethodField()

    class Meta:
        model = Industry
        fields = [
            "id",
            "name",
            "industry_type",
            "industry_email",
            "phone_number",
            "location",
            "address",
            "description",
            "number_of_employees",
            "website",
            "contact_person_phone_number",
            "contact_full_name",
            "contact_email",
        ]

    def get_contact_full_name(self, obj):
        user = obj.contact_person
        return f"{user.first_name} {user.father_name} {user.grand_father_name}".strip()

    def get_contact_email(self, obj):
        return obj.contact_person.email


class IndustryRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndustryRequest
        fields = [
            "id",
            "type",
            "title",
            "industry",
            "description",
            "attachment",
            "created_at",
        ]
        read_only_fields = ["id", "created_at", "industry"]

    def create(self, validated_data):
        request = self.context["request"]
        user = request.user

        # resolve industry from user
        try:
            industry = user.industry_profile
        except Industry.DoesNotExist:
            raise serializers.ValidationError("User is not linked to any Industry profile.")

        with transaction.atomic():
            # 1. create request
            industry_request = IndustryRequest.objects.create(
                created_by=user,
                industry=industry,
                **validated_data
            )

            # 2. create action automatically
            IndustryRequestAction.objects.create(
                request=industry_request,
                action_type="created",
                description=f"Request '{industry_request.title}' created by {user.id}",
                performed_by=user,
                from_industry=industry,
                created_by=user,
                updated_by=user,
            )

        return industry_request