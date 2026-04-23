from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction

from django.contrib.auth.hashers import make_password
from .models import Industry,IndustryRequest,IndustryRequestAction,TechnologySupportRequest,ConsultancyRequest,TrainingRequest,RecruitmentRequest,RequestAssignment
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
            status="approved",
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
class IndustryRequestActionSerializer(serializers.ModelSerializer):
    performed_by = serializers.StringRelatedField()
    from_industry = serializers.StringRelatedField()
    to_industry = serializers.StringRelatedField()
    from_unit = serializers.StringRelatedField()
    to_unit = serializers.StringRelatedField()
    forwarded_to = serializers.StringRelatedField()
    forwarded_from = serializers.StringRelatedField()

    class Meta:
        model = IndustryRequestAction
        fields = [
            "id",
            "type",
            "description",
            "performed_by",
            "from_industry",
            "to_industry",
            "from_unit",
            "to_unit",
            "forwarded_to",
            "forwarded_from",
            "created_at",
        ]
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
class TechnologySupportRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechnologySupportRequest
        fields = [
            "technology_required",
            "required_duration",
        ]
class ConsultancyRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultancyRequest
        fields = ["consultancy_type"]
class TrainingRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingRequest
        fields = [
            "training_type",
            "number_of_trainees",
            "trainee_level",
        ]
class RecruitmentRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruitmentRequest
        fields = [
            "field_of_study",
            "graduate_year",
            "requirements",
            "number_to_recruit",
        ]
class IndustryRequestCreateSerializer(serializers.ModelSerializer):

    # type-specific payload (dynamic input)
    extra_data = serializers.JSONField(write_only=True, required=False)

    class Meta:
        model = IndustryRequest
        fields = [
            "id",
            "type",
            "title",
            "industry",
            "description",
            "attachment",
            "extra_data",
            "created_at",
        ]
        read_only_fields = ["id", "created_at", "industry"]

    def validate(self, attrs):
        request_type = attrs.get("type")
        extra_data = self.initial_data.get("extra_data", {})

        # basic validation gate
        if request_type in ["tech_support", "consultancy", "training", "recruitment"] and not extra_data:
            raise serializers.ValidationError("extra_data is required for this request type")

        return attrs

    def create(self, validated_data):
        request = self.context["request"]
        user = request.user

        extra_data = self.initial_data.get("extra_data", {})

        try:
            industry = user.industry_profile
        except Exception:
            raise serializers.ValidationError("User has no industry profile")
        validated_data.pop("extra_data", None)

        with transaction.atomic():

            # 1. base request
            industry_request = IndustryRequest.objects.create(
                created_by=user,
                industry=industry,
                **validated_data
            )

            # 2. action log
            IndustryRequestAction.objects.create(
                request=industry_request,
                type="created",
                description="Request created",
                performed_by=user,
                from_industry=industry,
                created_by=user,
                updated_by=user,
            )

            # 3. create subtype model
            self._create_type_specific_model(industry_request, extra_data)

        return industry_request
    
    def _create_type_specific_model(self, industry_request, extra_data):
            REQUEST_SERIALIZER_MAP = {
                "tech_support": TechnologySupportRequestSerializer,
                "consultancy": ConsultancyRequestSerializer,
                "training": TrainingRequestSerializer,
                "recruitment": RecruitmentRequestSerializer,
            }
            request_type = industry_request.type

            serializer_class = REQUEST_SERIALIZER_MAP.get(request_type)

            if not serializer_class:
                return  # or raise error

            serializer = serializer_class(data=extra_data)
            serializer.is_valid(raise_exception=True)

            serializer.save(request=industry_request)
class IndustryRequestDetailSerializer(serializers.ModelSerializer):
    detail = serializers.SerializerMethodField()
    actions = IndustryRequestActionSerializer(many=True, read_only=True)

    class Meta:
        model = IndustryRequest
        fields = [
            "id",
            "type",
            "title",
            "industry",
            'actions',
            "description",
            "attachment",
            "created_at",
            "detail",
        ]

    def get_detail(self, obj):
        """
        Dynamically return subtype data based on request type.
        """

        if obj.type == "tech_support":
            instance = getattr(obj, "tech_support", None)
            print("printing here")
            return TechnologySupportRequestSerializer(instance).data if instance else None

        if obj.type == "consultancy":
            instance = getattr(obj, "consultancy", None)
            return ConsultancyRequestSerializer(instance).data if instance else None

        if obj.type == "training":
            instance = getattr(obj, "training", None)
            return TrainingRequestSerializer(instance).data if instance else None

        if obj.type == "recruitment":
            instance = getattr(obj, "recruitment", None)
            return RecruitmentRequestSerializer(instance).data if instance else None

        return None
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