import json
from pickle import TRUE
from django.contrib.auth import get_user_model
from django.db import transaction
from httpx import request
from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from rest_framework import serializers
from rest_framework import serializers
from authorization.utilis import is_unit_in_user_scope
from accounts.serializers import ContactPersonCreateSerializer, UserSerializer
from organizational_structure.serializers import OrganizationStructureListSerializer
from rest_framework.exceptions import PermissionDenied
from .models import (
    Industry,
    Request,
    RequestAction,
    Assignment
)
from bulletin.models import Post
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
        with transaction.atomic():
            user_serializer = ContactPersonCreateSerializer(data={
                "username": username,
                "first_name": first_name,
                "father_name": father_name,
                "grand_father_name": grand_father_name,
                "email": email,
                "password": password,
            })
            user_serializer.is_valid(raise_exception=True)
            user = user_serializer.save()

            industry = Industry.objects.create(
                contact_person=user,
                created_by_id=user.id,
                updated_by_id=user.id,
                **validated_data
            )

            role, _ = Role.objects.get_or_create(name="Industry")
            UserRole.objects.create(user=user, role=role)

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
    from_industry = serializers.StringRelatedField()
    to_industry = serializers.StringRelatedField()
    from_unit = serializers.StringRelatedField()
    to_unit = serializers.StringRelatedField()


    class Meta:
        model = RequestAction
        fields = [
            "id",
            "type",
            "description",
            "from_industry",
            "to_industry",
            "from_unit",
            "to_unit",
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


class RequestCreateSerializer(serializers.ModelSerializer):
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
            "created_at",
        ]
        read_only_fields = ["id", "created_at",]

        extra_kwargs = {
            "industry": {
                "required": False,
                "allow_null": True
            }
        }

    def _parse_extra_data(self):
        extra_data = self.initial_data.get("extra_data", {})

        if isinstance(extra_data, str):
            try:
                extra_data = json.loads(extra_data)
            except json.JSONDecodeError:
                raise serializers.ValidationError(
                    {"extra_data": "Invalid JSON format"})

        return extra_data

    def create(self, validated_data):
        user = self.context["request"].user

        requesting_entity = validated_data.pop("requesting_entity")

        industry = validated_data.pop("industry", None)
        academic_unit_id = validated_data.get("academic_unit", None)

        with transaction.atomic():
            if requesting_entity == "industry":
                if industry:
                    industry = Industry.objects.filter(id=industry.id).first()
                    if not industry:
                        raise serializers.ValidationError(
                            {"industry": "Invalid industry"})
                else:
                    industry = getattr(user, "industry_profile", None)
                    if not industry:
                        raise serializers.ValidationError(
                            {"industry": "Industry id required or user must have industry profile"}
                        )

                if industry.contact_person != user:
                    raise serializers.ValidationError(
                        "You are not allowed for this industry"
                    )
                request = Request.objects.create(
                    created_by_id=user.id,
                    industry=industry,
                    requesting_entity="industry",
                    **validated_data
                )

                RequestAction.objects.create(
                    request=request,
                    type="created",
                    description="Request created",
                    from_industry=industry,
                    created_by_id=user.id,
                    updated_by_id=user.id,

                )
            elif requesting_entity == "academic_unit":
                if not academic_unit_id:
                    raise serializers.ValidationError(
                        {"academic_unit": "This field is required"})

                allowed = is_unit_in_user_scope(
                    user=user,
                    permission_codes=["can_create_request"],
                    academic_unit_id=academic_unit_id
                )

                if not allowed:
                    raise serializers.ValidationError(
                        "Not allowed for this academic unit")

                request = Request.objects.create(
                    created_by_id=user.id,
                    academic_unit_id=academic_unit_id,
                    requesting_entity="academic_unit",
                    **validated_data
                )

                RequestAction.objects.create(
                    request=request,
                    type="created",
                    description="Request created",
                    from_unit_id=academic_unit_id,
                    created_by_id=user.id,
                    updated_by_id=user.id,
                )

            else:
                raise serializers.ValidationError("Invalid requesting_entity")

        return request


class RequestDetailSerializer(serializers.ModelSerializer):
    detail = serializers.SerializerMethodField()
    actions = RequestActionSerializer(many=True, read_only=True)
    academic_unit = OrganizationStructureListSerializer(read_only=True)
    industry = IndustrySerializer(read_only=True)
    supported_actions = serializers.SerializerMethodField()
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
    def get_supported_actions(self, obj):
        return [choice.value for choice in RequestAction.ACTION_TYPES]


class RequestSerializer(serializers.ModelSerializer):
    academic_unit = OrganizationStructureListSerializer(read_only=True)
    latest_action = serializers.SerializerMethodField()

    class Meta:
        model = Request
        fields = [
            "id",
            "type",
            "title",
            "industry",
            "academic_unit",
            "latest_action",
            "description",
            "attachment",
            "created_at",
        ]
        read_only_fields = ["id", "created_at", "industry"]

    def get_latest_action(self, obj):
        action = obj.actions.order_by("-created_at").first()
        return action.type if action else None


# action related serializer
class RequestActionGenericSerializer(serializers.ModelSerializer):

    class Meta:
        model = RequestAction
        fields = [
            "id",
            "type",
            "description",
        ]
        read_only_fields = ["id"]

    def validate(self, attrs):
        request_obj = self.context.get("request_obj")
        user = self.context["request"].user

        if not request_obj:
            raise serializers.ValidationError("Missing request context")

        action_type = attrs.get("type")

        # apply uniqueness ONLY for "created"
        if action_type == RequestAction.ACTION_TYPES.CREATED:
            exists = RequestAction.objects.filter(
                request=request_obj,
                type=action_type
            ).exists()

            if exists:
                raise serializers.ValidationError({
                    "type": "This request is already created."
                })
        
        # check wether there is already forward request and accepting user is in that scope
        elif action_type == RequestAction.ACTION_TYPES.ACCEPT_FORWARDED:
            forwarded_action = request_obj.actions.filter(
            type=RequestAction.ACTION_TYPES.FORWARDED
            ).order_by("-created_at").first()
            if not forwarded_action:
                raise serializers.ValidationError({
                        "type": "No forwarded action found for this request."
                    })

            unit_id = forwarded_action.to_unit_id

            allowed = is_unit_in_user_scope(
                user=user,
                permission_codes=["can_create_request_action"],
                academic_unit_id=unit_id
            )

            if not allowed:
                raise PermissionDenied("You are not allowed to accept this forward.")
            self._target_unit_id = unit_id
            
        elif action_type in [
                RequestAction.ACTION_TYPES.REVOKED,
                RequestAction.ACTION_TYPES.CANCELLED,
                RequestAction.ACTION_TYPES.COMPLETED
            ]:
            assignment = Assignment.objects.filter(
                    request=request_obj,
                    status__in=[
                        Assignment.AssignmentStatus.ACCEPTED,
                        Assignment.AssignmentStatus.ACCEPTED
                    ]
                ).first()
            if assignment:
                self.assignment = assignment
            
            if action_type== RequestAction.ACTION_TYPES.REVOKED:
                
                if not assignment:
                    raise serializers.ValidationError(
                        "No active assignment found to revoke."
                    )
        
        return attrs

    def create(self, validated_data):
        request_obj = self.context.get("request_obj")
        user = self.context["request"]

        action_type = validated_data["type"]

        with transaction.atomic():
            if action_type in [
                RequestAction.ACTION_TYPES.REVOKED,
                RequestAction.ACTION_TYPES.CANCELLED,
            ]:
                if getattr(self, "assignment", None):
                    self.assignment.status = Assignment.AssignmentStatus.CANCELLED
                    self.assignment.save(update_fields=["status"])
            
            elif action_type in [
                RequestAction.ACTION_TYPES.COMPLETED,
            ]:
                if getattr(self, "assignment", None):
                    self.assignment.status = Assignment.AssignmentStatus.COMPLETED
                    self.assignment.save(update_fields=["status"])
            
            elif action_type== RequestAction.ACTION_TYPES.ACCEPT_FORWARDED:
                request_obj.academic_unit_id = self._target_unit_id
                request_obj.save(update_fields=["academic_unit"])
                
            return RequestAction.objects.create(
                request=request_obj,
                created_by_id=user.id,
                updated_by_id=user.id,
                **validated_data
            )

class RequestActionAssignedSerializer(serializers.ModelSerializer):
    assigned_user = serializers.PrimaryKeyRelatedField(
        queryset=Assignment._meta.get_field("assigned_user")
        .remote_field.model.objects.all(),
        required=False,
        allow_null=True
    )
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)
    industry_mentor = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = RequestAction
        fields = [
            "id",
            "type",
            "description",
            "assigned_user",
            "start_date",
            "end_date",
            "industry_mentor",
        ]
        read_only_fields = ["id"]

    def validate(self, attrs):
        request_obj = self.context.get("request_obj")
        action_type = attrs.get("type")

        if not request_obj:
            raise serializers.ValidationError("Missing request context")

        if action_type not in ["assigned", "reassigned"]:
            return attrs

        assigned_user = attrs.get("assigned_user")
        start_date = attrs.get("start_date")
        end_date = attrs.get("end_date")

        # date validation
        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError({
                "end_date": "End date must be after start date"
            })

        if action_type == "assigned":
            if not all([assigned_user, start_date, end_date]):
                raise serializers.ValidationError("Missing required assignment fields")

            exists = Assignment.objects.filter(
                request=request_obj,
                assigned_user=assigned_user
            ).exists()

            if exists:
                raise serializers.ValidationError({
                    "assigned_user": "This user is already assigned"
                })

        elif action_type == "reassigned":
            assignment = Assignment.objects.filter(
                request=request_obj,
                status__in=[
                    Assignment.AssignmentStatus.ACCEPTED,
                    Assignment.AssignmentStatus.ACTIVE
                ]
            ).first()

            if not assignment:
                raise serializers.ValidationError({
                    "request": "No active assignment to reassign"
                })

            if assigned_user:
                exists = Assignment.objects.filter(
                    request=request_obj,
                    assigned_user=assigned_user
                ).exists()

                if exists:
                    raise serializers.ValidationError({
                        "assigned_user": "This user is already assigned"
                    })

            # fallback values
            attrs["assigned_user"] = assigned_user or assignment.assigned_user
            attrs["start_date"] = start_date or assignment.start_date
            attrs["end_date"] = end_date or assignment.end_date
            attrs["industry_mentor"] = (
                attrs.get("industry_mentor")
                if attrs.get("industry_mentor") is not None
                else assignment.industry_mentor
            )

            self.assignment = assignment

        return attrs

    def create(self, validated_data):
        request_obj = self.context.get("request_obj")
        user = self.context["request"].user
        action_type = validated_data.get("type")

        assigned_user = validated_data.pop("assigned_user", None)
        start_date = validated_data.pop("start_date", None)
        end_date = validated_data.pop("end_date", None)
        industry_mentor = validated_data.pop("industry_mentor", None)

        with transaction.atomic():

            if action_type == RequestAction.ACTION_TYPES.ASSIGNED:
                Assignment.objects.create(
                    request=request_obj,
                    assigned_user=assigned_user,
                    start_date=start_date,
                    end_date=end_date,
                    industry_mentor=industry_mentor,
                    status=Assignment.AssignmentStatus.ACTIVE,
                    created_by=user,
                    updated_by=user,
                )

            elif action_type == RequestAction.ACTION_TYPES.REASSIGNED:
                # cancel old
                self.assignment.status = Assignment.AssignmentStatus.CANCELLED
                self.assignment.save(update_fields=["status"])

                # create new
                Assignment.objects.create(
                    request=request_obj,
                    assigned_user=assigned_user,
                    start_date=start_date,
                    end_date=end_date,
                    industry_mentor=industry_mentor,
                    status="active",
                    created_by=user,
                    updated_by=user,
                )

            action = RequestAction.objects.create(
                request=request_obj,
                created_by=user,
                updated_by=user,
                **validated_data
            )

        return action

class RequestActionForwardedSerializer(serializers.ModelSerializer):

    class Meta:
        model = RequestAction
        fields = [
            "id",
            "type",
            "description",
            'to_unit',
            'from_unit'
        ]
        read_only_fields = ["id"]

    def validate(self, attrs):
        from_unit = attrs.get("from_unit")
        to_unit = attrs.get("to_unit")
        request_obj = self.context.get("request_obj")

        attrs["type"] = "forwarded"
        exists = Assignment.objects.filter(
            request=request_obj
            ).exists()

        if exists:
            # more validation gonna be added here a senario like assinged then cancelled then forwarding 
            raise serializers.ValidationError({
                "request": "This request is already assigned and cannot be forwarded"
            })

        if not from_unit:
            raise serializers.ValidationError({
                "from_unit": "This field is required."
            })

        if not to_unit:
            raise serializers.ValidationError({
                "to_unit": "This field is required."
            })

        if from_unit == to_unit:
            raise serializers.ValidationError({
                "to_unit": "Cannot forward to the same unit."
            })

        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        action = RequestAction.objects.create(
                created_by_id=user.id,
                updated_by_id=user.id,
                **validated_data
            )
        return action

class RequestActionPostedThematicSerializer(serializers.ModelSerializer):
    # Post fields
    title = serializers.CharField()
    content = serializers.CharField()
    description = serializers.CharField()
    is_internal_only = serializers.BooleanField(default=False)
    expires_at = serializers.DateTimeField(required=False, allow_null=True)
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = RequestAction
        fields = [
            "id",
            "type",
            "title",
            "content",
            "description",
            "is_internal_only",
            "expires_at",
            "image",
        ]
        read_only_fields = ["id"]

    def validate(self, attrs):
        request_obj = self.context.get("request_obj")

        # enforce type
        attrs["type"] = "posted_as_thematic"

        exists = RequestAction.objects.filter(
            request=request_obj,
            type="posted_as_thematic"
        ).exists()

        if exists:
            raise serializers.ValidationError({
                "type": "This request is already posted as thematic."
            })

        return attrs

    def create(self, validated_data):
        request_obj = self.context.get("request_obj")
        user = self.context["request"].user

        # extract post fields
        post_data = {
            "title": validated_data.pop("title"),
            "content": validated_data.pop("content"),
            "is_internal_only": validated_data.pop("is_internal_only", False),
            "expires_at": validated_data.pop("expires_at", None),
            "image": validated_data.pop("image", None),
        }

        with transaction.atomic():
            post = Post.objects.create(
                **post_data,
                post_type="thematic_area",
                content_type=ContentType.objects.get_for_model(request_obj),
                object_id=request_obj.id,
                is_published=True,
                published_at=timezone.now(),
                created_by_id=user.id,
                updated_by_id=user.id,
            )

            action = RequestAction.objects.create(
                created_by_id=user.id,
                updated_by_id=user.id,
                **validated_data
            )

        return action

class RequestActionRepliedSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = RequestAction
        fields = [
            "id",
            "type",
            "description",
            "from_unit",
            "to_unit",
            "from_industry",
            "to_industry",
        ]
        read_only_fields = ["id"]
        
    def validate(self, attrs):

        from_unit = attrs.get("from_unit")
        from_industry = attrs.get("from_industry")
        to_unit = attrs.get("to_unit")
        to_industry = attrs.get("to_industry")

        source_count = sum([
            bool(from_unit),
            bool(from_industry)
        ])

        if source_count != 1:
            raise serializers.ValidationError(
                "Exactly one source is required (unit or industry)."
            )

        target_count = sum([
            bool(to_unit),
            bool(to_industry)
        ])

        if target_count != 1:
            raise serializers.ValidationError(
                "Exactly one target is required (unit or industry)."
            )

        source_type = "unit" if from_unit else "industry"
        target_type = "unit" if to_unit else "industry"

        if source_type == target_type:
            raise serializers.ValidationError(
                "unit → unit and industry → industry are not allowed"
            )

        return attrs

    def create(self, validated_data):
        user = self.context["request"].user

        return RequestAction.objects.create(  
                    created_by_id=user.id,
                    updated_by_id=user.id ,                   
                    **validated_data
                    )


ACTION_SERIALIZERS = {
            "created":RequestActionGenericSerializer,
            "accept_forwarded": RequestActionGenericSerializer,
            "revoked":RequestActionGenericSerializer,
            "cancelled":RequestActionGenericSerializer,
            "replied": RequestActionRepliedSerializer,
            "rejected":RequestActionGenericSerializer,
            "completed":RequestActionGenericSerializer,
            "assigned":RequestActionAssignedSerializer,
            "reassigned":RequestActionAssignedSerializer,
            "forwarded": RequestActionForwardedSerializer,
            "posted_as_thematic": RequestActionPostedThematicSerializer,
            
        }

class AssignmentListSerializer(serializers.ModelSerializer):
    request=RequestSerializer(read_only=TRUE)
    assigned_user=UserSerializer()
    class Meta:
        model = Assignment
        fields = [
            "id",
            "request",
            "assigned_user",
            "start_date",
            "industry_mentor",
            "end_date",
            "status",
        ]

class AssignmentDetailSerializer(serializers.ModelSerializer):
    request=RequestDetailSerializer(read_only=True)
    class Meta:
        model = Assignment
        fields = [
            "id",
            "request",
            "assigned_user",
            "industry_mentor",
            "start_date",
            "end_date",
            "status",
        ]


class LatestActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestAction
        fields = [
            "id",
            "type",
            "description",
            "assigned_user",
            "from_unit",
            "to_unit",
            "from_industry",
            "to_industry",
            "created_at",
        ]


class AdminRequestListSerializer(serializers.ModelSerializer):
    latest_action = serializers.SerializerMethodField()

    class Meta:
        model = Request
        fields = [
            "id",
            "title",
            "type",
            "requesting_entity",
            "industry",
            "academic_unit",
            "created_at",
            "latest_action",
        ]

    def get_latest_action(self, obj):
        action = getattr(obj, "latest_action_obj", None)
        if not action:
            return None
        return LatestActionSerializer(action).data


