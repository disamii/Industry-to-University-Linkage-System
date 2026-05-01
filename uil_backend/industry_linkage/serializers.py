import json
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.db import transaction
from rest_framework import serializers
from rest_framework import serializers
from authorization.utilis import  is_unit_in_user_scope
from organizational_structure.serializers import OrganizationStructureListSerializer
from .models import (
    Industry, 
    Request, 
    RequestAction, 
    TechnologySupportRequest, 
    ConsultancyRequest, 
    TrainingRequest, 
    RecruitmentRequest, 
    RnDRequest, 
    InternshipRequest, 
    TestingRequest,
    CurriculumReviewRequest,
    IndustrialVisitRequest,
    JointResearchRequest,
    GuestLectureRequest,
    TechTransferRequest,
)
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
            data["contact_full_name"] = f"{user.first_name} {user.father_name} {user.grand_father_name}".strip(
            )
            data["contact_email"] = user.email

        return data


class RequestActionSerializer(serializers.ModelSerializer):
    performed_by = serializers.StringRelatedField()
    from_industry = serializers.StringRelatedField()
    to_industry = serializers.StringRelatedField()
    from_unit = serializers.StringRelatedField()
    to_unit = serializers.StringRelatedField()
    forwarded_to = serializers.StringRelatedField()
    forwarded_from = serializers.StringRelatedField()

    class Meta:
        model = RequestAction
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


class RequestActionCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = RequestAction
        fields = [
            "request",
            "type",
            "description",
            "from_industry",
            "from_unit",
            "to_industry",
            "to_unit",
            "forwarded_to",
            "forwarded_from",
        ]

    def validate(self, attrs):
        action_type = attrs.get("type")
        request_obj = self.context.get("request_obj")

        if not request_obj:
            raise serializers.ValidationError("Request context is required")

        if action_type == "assigned":
            if not attrs.get("to_unit") and not attrs.get("to_industry"):
                raise serializers.ValidationError("Assigned requires target")

        if action_type == "forwarded":
            if not attrs.get("forwarded_to"):
                raise serializers.ValidationError("Forwarded requires forwarded_to")

        if action_type == "accept_forwarded":
                    forwarded_action = request_obj.actions.filter(
                        type="forwarded"
                    ).order_by("-created_at").first()

                    if not forwarded_action:
                        raise serializers.ValidationError("No forwarded action found")

                    if forwarded_action.forwarded_to_id == request_obj.requested_to_id:
                        raise serializers.ValidationError(
"No state change required: request already assigned to this unit."                        )


        return attrs
    def create(self, validated_data):
        user = self.context["request"].user
        return RequestAction.objects.create(
            performed_by=user,
            **validated_data
        )


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


class RnDRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RnDRequest
        fields = [
            "request",
            "problem_statement",
            "research_area",
        ]


class TestingRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestingRequest
        fields = [
            "item_to_test",
            "test_type",
        ]


class InternshipRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternshipRequest
        fields = [
            "field_of_study",
            "number_of_students",
            "timeframe",
            "activities"
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


class RequestCreateSerializer(serializers.ModelSerializer):

    extra_data = serializers.JSONField(write_only=True, required=False)

    class Meta:
        model = Request
        fields = [
            "id",
            "type",
            "title",
            "academic_unit",
            "industry",
            "description",
            "requesting_entity",
            "attachment",
            "extra_data",
            "created_at",
        ]
        read_only_fields = ["id", "created_at",]

    def _parse_extra_data(self):
        extra_data = self.initial_data.get("extra_data", {})

        if isinstance(extra_data, str):
            try:
                extra_data = json.loads(extra_data)
            except json.JSONDecodeError:
                raise serializers.ValidationError(
                    {"extra_data": "Invalid JSON format"})

        return extra_data

    def validate(self, attrs):
        request_type = attrs.get("type")
        extra_data = self._parse_extra_data()
        requesting_entity = attrs.get("requesting_entity")
        if requesting_entity == "industry":

            if request_type in [
                "tech_support",
                "consultancy",
                "training",
                "recruitment"
                ] and not extra_data:
                raise serializers.ValidationError(
                    "extra_data is required for this request type")
        elif requesting_entity == "academic_unit":

            if request_type in [
                "curriculum_review",
                "industrial_visit",
                "joint_research",
                "guest_lecture",
                "tech_transfer",
                            ] and not extra_data:
                raise serializers.ValidationError(
                    "extra_data is required for this request type")
        
        return attrs




    def create(self, validated_data):
        user = self.context["request"].user

        extra_data = validated_data.pop("extra_data", {})
        requesting_entity = validated_data.pop("requesting_entity")

        industry_id = validated_data.pop("industry", None)
        academic_unit_id = validated_data.pop("academic_unit", None)

        with transaction.atomic():
            if requesting_entity == "industry":
                if industry_id:
                    industry = Industry.objects.filter(id=industry_id).first()
                    if not industry:
                        raise serializers.ValidationError({"industry": "Invalid industry"})
                else:
                    industry = getattr(user, "industry_profile", None)
                    if not industry:
                        raise serializers.ValidationError(
                            {"industry": "Industry id required or user must have industry profile"}
                        )

                if not industry.contact_persons.filter(user=user).exists():
                    raise serializers.ValidationError(
                        "You are not allowed for this industry"
                    )
                request = Request.objects.create(
                    created_by=user,
                    industry=industry,
                    requesting_entity="industry",
                    **validated_data
                )

                RequestAction.objects.create(
                    request=request,
                    type="created",
                    description="Request created",
                    performed_by=user,
                    from_industry=industry,
                    created_by=user,
                    updated_by=user,

                )
            elif requesting_entity == "academic_unit":
                if not academic_unit_id:
                    raise serializers.ValidationError({"academic_unit": "This field is required"})

                allowed = is_unit_in_user_scope(
                    user=user,
                    permission_codes=["can_create_request"],
                    academic_unit_id=academic_unit_id
                )

                if not allowed:
                    raise serializers.ValidationError("Not allowed for this academic unit")

                request = Request.objects.create(
                    created_by=user,
                    academic_unit_id=academic_unit_id,
                    requesting_entity="academic_unit",
                    **validated_data
                )

                RequestAction.objects.create(
                    request=request,
                    type="created",
                    description="Request created",
                    performed_by=user,
                    from_unit_id=academic_unit_id,
                    created_by=user,
                    updated_by=user,
                )

            else:
                raise serializers.ValidationError("Invalid requesting_entity")
            self._create_type_specific_model(request, extra_data)

        return request
    def _create_type_specific_model(self, industry_request, extra_data):
        
        request_type = industry_request.type
        requesting_entity=industry_request.requesting_entity
        if requesting_entity=="industry":
            REQUEST_SERIALIZER_MAP = {
                "tech_support": TechnologySupportRequestSerializer,
                "consultancy": ConsultancyRequestSerializer,
                "training": TrainingRequestSerializer,
                "recruitment": RecruitmentRequestSerializer,
                "rnd": RnDRequestSerializer,
                "internship": InternshipRequestSerializer,
                "testing": TestingRequestSerializer
            }
        if requesting_entity=="academic_unit":

            REQUEST_SERIALIZER_MAP = {
                "curriculum_review": CurriculumReviewRequestSerializer,
                "industrial_visit": IndustrialVisitRequestSerializer,
                "joint_research": JointResearchRequestSerializer,
                "guest_lecture": GuestLectureRequestSerializer,
                "tech_transfer": TechTransferRequestSerializer,
            }
        serializer_class = REQUEST_SERIALIZER_MAP.get(request_type)

        if not serializer_class:
            return  

        serializer = serializer_class(data=extra_data)
        serializer.is_valid(raise_exception=True)

        serializer.save(request=industry_request)


class RequestDetailSerializer(serializers.ModelSerializer):
    detail = serializers.SerializerMethodField()
    actions = RequestActionSerializer(many=True, read_only=True)
    requested_to = OrganizationStructureListSerializer(read_only=True)

    class Meta:
        model = Request
        fields = [
            "id",
            "type",
            "title",
            "industry",
            "requesting_entity",
            'actions',
            'academic_unit',
            "description",
            "attachment",
            "created_at",
            "detail",
        ]

    def get_detail(self, obj):
        """
        Dynamically return subtype data based on request type.
        """

        DETAIL_MAP = {
            # Industry
            "tech_support": ("tech_support", TechnologySupportRequestSerializer),
            "consultancy": ("consultancy", ConsultancyRequestSerializer),
            "training": ("training", TrainingRequestSerializer),
            "recruitment": ("recruitment", RecruitmentRequestSerializer),
            "rnd": ("rnd", RnDRequestSerializer),
            "internship": ("internship", InternshipRequestSerializer),
            "testing": ("testing", TestingRequestSerializer),

            # Academic Unit
            "curriculum_review": ("curriculum_review", CurriculumReviewRequestSerializer),
            "industrial_visit": ("industrial_visit", IndustrialVisitRequestSerializer),
            "joint_research": ("joint_research", JointResearchRequestSerializer),
            "guest_lecture": ("guest_lecture", GuestLectureRequestSerializer),
            "tech_transfer": ("tech_transfer", TechTransferRequestSerializer),
            "lab_access": ("lab_access", None),  # add serializer if exists
        }

        config = DETAIL_MAP.get(obj.type)
        if not config:
            return None

        relation_name, serializer_class = config

        instance = getattr(obj, relation_name, None)
        if not instance or not serializer_class:
            return None

        return serializer_class(instance).data


class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
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


class CurriculumReviewRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurriculumReviewRequest
        fields = "__all__"
        read_only_fields = ["id"]


class IndustrialVisitRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndustrialVisitRequest
        fields = "__all__"
        read_only_fields = ["id"]


class JointResearchRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = JointResearchRequest
        fields = "__all__"
        read_only_fields = ["id"]


class GuestLectureRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuestLectureRequest
        fields = "__all__"
        read_only_fields = ["id"]


class TechTransferRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechTransferRequest
        fields = "__all__"
        read_only_fields = ["id"]



class RequestCreateSerializer(serializers.ModelSerializer):
    extra_data = serializers.JSONField(write_only=True, required=False)

    class Meta:
        model = Request
        fields = [
            "id",
            "type",
            "title",
            "requested_to",
            "university",
            "description",
            "attachment",
            "extra_data",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def _parse_extra_data(self):
        extra_data = self.initial_data.get("extra_data", {})

        if isinstance(extra_data, str):
            try:
                extra_data = json.loads(extra_data)
            except json.JSONDecodeError:
                raise serializers.ValidationError(
                    {"extra_data": "Invalid JSON format"}
                )
        return extra_data

    def validate(self, attrs):
        request_type = attrs.get("type")
        extra_data = self._parse_extra_data()

        REQUIRED_TYPES = [
            "curriculum_review",
            "industrial_visit",
            "joint_research",
            "guest_lecture",
            "tech_transfer",
        ]

        if request_type in REQUIRED_TYPES and not extra_data:
            raise serializers.ValidationError(
                {"extra_data": "This field is required for this request type"}
            )

        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        extra_data = validated_data.pop("extra_data", {})

        university = getattr(user, "university_profile", None)
        if not university:
            raise serializers.ValidationError("User has no university profile")

        with transaction.atomic():
            university_request = Request.objects.create(
                created_by=user,
                university=university,
                **validated_data
            )

            RequestAction.objects.create(
                request=university_request,
                type="created",
                description="Request created",
                performed_by=user,
                from_university=university,
                created_by=user,
                updated_by=user,
            )

            self._create_type_specific_model(university_request, extra_data)

        return university_request

    def _create_type_specific_model(self, university_request, extra_data):
        REQUEST_SERIALIZER_MAP = {
            "curriculum_review": CurriculumReviewRequestSerializer,
            "industrial_visit": IndustrialVisitRequestSerializer,
            "joint_research": JointResearchRequestSerializer,
            "guest_lecture": GuestLectureRequestSerializer,
            "tech_transfer": TechTransferRequestSerializer,
        }

        request_type = university_request.type
        serializer_class = REQUEST_SERIALIZER_MAP.get(request_type)

        if not serializer_class:
            return

        serializer = serializer_class(data=extra_data)
        serializer.is_valid(raise_exception=True)
        serializer.save(request=university_request)