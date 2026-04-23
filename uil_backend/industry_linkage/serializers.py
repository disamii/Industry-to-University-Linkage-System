from rest_framework import serializers
from django.contrib.auth import get_user_model

from django.contrib.auth.hashers import make_password
from .models import Industry
User = get_user_model()


class IndustryCreateSerializer(serializers.ModelSerializer):
    # incoming fields
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
            # contact person inputs
            "contact_full_name",
            "contact_email",
            "contact_password",
            "contact_person_phone_number"
        ]
        read_only_fields = ["id"]

    def create(self, validated_data):
        # extract contact data
        full_name = validated_data.pop("contact_full_name")
        email = validated_data.pop("contact_email")
        password = validated_data.pop("contact_password")

        # split full name
        parts = full_name.strip().split()
        first_name = parts[0] if len(parts) > 0 else ""
        father_name = parts[1] if len(parts) > 1 else ""
        grand_father_name = parts[2] if len(parts) > 2 else ""

        # username logic → industryname_firstname
        industry_name = validated_data.get("name")
        username = f"{industry_name}_{first_name}".lower().replace(" ", "")

        # create user
        user = User.objects.create(
            username=username,
            first_name=first_name,
            father_name=father_name,
            grand_father_name=grand_father_name,
            email=email,
            password=make_password(password),
        )

        # create industry
        industry = Industry.objects.create(
            contact_person=user,
            **validated_data
        )

        return industry