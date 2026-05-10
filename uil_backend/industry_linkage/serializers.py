import json
from pickle import TRUE
from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from rest_framework import serializers
from rest_framework import serializers
from authorization.utilis import is_unit_in_user_scope
from accounts.serializers import ContactPersonCreateSerializer, UserSerializer
from organizational_structure.serializers import OrganizationStructureListSerializer
from rest_framework.exceptions import PermissionDenied, ValidationError
from organizational_structure.models import OrganizationalUnit
from .enums import ActionTypes, AssignmentStatus, RequestingEntity, get_assignment_supported_actions
from .models import (
    Industry,
    Request,
    RequestAction,
    Assignment
)
from bulletin.models import Post
from bulletin.serializers import PostListSerializer
from .utils import ForwardTarget, EntityReceiverField, get_supported_actions_rule, validate_action_or_raise,is_industry_user
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


class GenericActorField(serializers.Field):

    def to_representation(self, obj):
        if not obj:
            return None

        content_type = ContentType.objects.get_for_model(obj)

        model_name = content_type.model

        serializer_class = CONTENT_TYPE_SERIALIZER_MAP.get(model_name)

        if not serializer_class:
            return {
                "id": obj.id,
                "type": model_name,
                "repr": str(obj),
            }

        return serializer_class(obj, context=self.context).data


class RequestActionSerializer(serializers.ModelSerializer):
    supported_actions = serializers.SerializerMethodField()
    actor_from = GenericActorField()
    actor_to = GenericActorField()
    resulted_object = GenericActorField()

    class Meta:
        model = RequestAction
        fields = [
            "id",
            "type",
            "description",
            "actor_from",
            "actor_to",
            "resulted_object",
            "awaiting_decision",
            "supported_actions",
            "created_at",
        ]

    def get_supported_actions(self, obj):
        user = self.context.get("request").user
        return get_supported_actions_rule(obj, user)


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
            },
            "academic_unit": {
                "required": False,
                "allow_null": True
            }
        }

    def create(self, validated_data):
        user = self.context["request"].user

        requesting_entity = validated_data.pop("requesting_entity")

        industry = validated_data.pop("industry", None)
        academic_unit_id = validated_data.get("academic_unit", None)

        with transaction.atomic():
            if requesting_entity == RequestingEntity.INDUSTRY:
                if industry:
                    industry = Industry.objects.filter(id=industry.id).first()
                    if not industry:
                        raise serializers.ValidationError(
                            "Invalid industry")
                else:
                    industry = getattr(user, "industry_profile", None)
                    if not industry:
                        raise serializers.ValidationError(
                            "Industry id required or user must have industry profile")

                if industry.contact_person != user:
                    raise serializers.ValidationError(
                        "You are not allowed for this industry"
                    )

            elif requesting_entity == RequestingEntity.ACADEMIC_UNIT:
                if not academic_unit_id:
                    raise serializers.ValidationError(
                        "academic_unit field is required")

                allowed = is_unit_in_user_scope(
                    user=user,
                    permission_codes=["can_create_request"],
                    academic_unit_id=academic_unit_id
                )

                if not allowed:
                    raise serializers.ValidationError(
                        "Not allowed for this academic unit")

            elif requesting_entity == RequestingEntity.STAFF:
                if not academic_unit_id:
                    academic_unit = user.academic_unit

                    if not academic_unit:
                        raise serializers.ValidationError(
                            "Staff user has no assigned academic unit.")

                    validated_data["academic_unit"] = academic_unit

            request = Request.objects.create(
                created_by_id=user.id,
                requested_by=user,
                industry=industry,
                requesting_entity=requesting_entity,
                **validated_data
            )

            RequestAction.objects.create(
                request=request,
                type=ActionTypes.INITIATED,
                description="Request Initiated",
                created_by_id=user.id,
                updated_by_id=user.id,

            )
        return request


class RequestDetailSerializer(serializers.ModelSerializer):
    actions = RequestActionSerializer(many=True, read_only=True)
    academic_unit = OrganizationStructureListSerializer(read_only=True)
    industry = IndustrySerializer(read_only=True)
    supported_actions = serializers.SerializerMethodField()
    requested_by = UserSerializer(read_only=True)

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
            'requested_by',
            "description",
            "attachment",
            "created_at",
            "supported_actions",
        ]

    def get_supported_actions(self, obj):

        last_action = obj.actions.order_by("-created_at").first()

        if last_action and last_action.type in [
            ActionTypes.COMPLETED,
            ActionTypes.CANCELLED,
            ActionTypes.REJECTED,
        ]:
            return []

        user = self.context.get("user")

        is_industry = is_industry_user(user,obj.industry.id)
        valid_actions = []

        for action_type in ActionTypes:
            if action_type in (
                ActionTypes.INITIATED,
                ActionTypes.REVERTED,
            ):
                continue

            try:
                validate_action_or_raise(obj, action_type)
            except ValidationError:
                continue

            valid_actions.append(action_type.value)
        
        if is_industry or obj.requesting_entity == RequestingEntity.STAFF:
            remove_actions = {
                        ActionTypes.FORWARDED.value,
                        ActionTypes.ACCEPT_FORWARDED.value,
                        ActionTypes.ASSIGNED.value,
                        ActionTypes.POSTED_AS_THEMATIC.value,
                    }
            valid_actions[:] = [
                        action for action in valid_actions if action not in remove_actions
                    ]

        if obj.requesting_entity == RequestingEntity.INDUSTRY:
            if is_industry:
                if ActionTypes.REJECTED.value in valid_actions:
                    valid_actions.remove(ActionTypes.REJECTED.value)
            else:
                if ActionTypes.CANCELLED.value in valid_actions:
                    valid_actions.remove(ActionTypes.CANCELLED.value)
                    
        
        if obj.requesting_entity == RequestingEntity.STAFF or obj.requesting_entity == RequestingEntity.ACADEMIC_UNIT:
            if  is_industry:
                
                if ActionTypes.CANCELLED.value in valid_actions:
                    valid_actions.remove(ActionTypes.CANCELLED.value)
            else:
                if ActionTypes.REJECTED.value in valid_actions:
                    valid_actions.remove(ActionTypes.REJECTED.value)
        

        return valid_actions


class RequestSerializer(serializers.ModelSerializer):
    academic_unit = OrganizationStructureListSerializer(read_only=True)
    latest_action = serializers.SerializerMethodField()
    industry = IndustrySerializer(read_only=True)
    requested_by = UserSerializer(read_only=True)

    class Meta:
        model = Request
        fields = [
            "id",
            "type",
            "title",
            "industry",
            "academic_unit",
            "requested_by",
            "latest_action",
            "description",
            "attachment",
            "created_at",
        ]
        read_only_fields = ["id", "created_at", "industry"]

    def get_latest_action(self, obj):
        action = obj.actions.order_by("-created_at").first()
        return action.type if action else None


class IndustryDetailSerializer(serializers.ModelSerializer):
    contact_full_name = serializers.SerializerMethodField()
    contact_email = serializers.SerializerMethodField()

    requests = RequestSerializer(many=True, read_only=True)

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
            "requests",
        ]

    def get_contact_full_name(self, obj):
        user = obj.contact_person
        return f"{user.first_name} {user.father_name} {user.grand_father_name}".strip()

    def get_contact_email(self, obj):
        return obj.contact_person.email


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

        if action_type == ActionTypes.ACCEPT_FORWARDED:

            forwarded_action = request_obj.actions.filter(
                type=ActionTypes.FORWARDED
            ).order_by("-created_at").first()
            if not forwarded_action:
                raise serializers.ValidationError(
                    "No forwarded action found to accept.")

            unit_id = forwarded_action.to_object_id

            from django.contrib.contenttypes.models import ContentType
            unit_ct = ContentType.objects.get(
                app_label="organizational_structure",
                model="organizationalunit"
            )

            if forwarded_action.to_content_type != unit_ct:
                raise PermissionDenied(
                    "This forward was not directed to an academic unit.")

            allowed = is_unit_in_user_scope(
                user=user,
                permission_codes=["can_create_request_action"],
                academic_unit_id=unit_id
            )

            if not allowed:
                raise PermissionDenied(
                    "You are not allowed to accept this forward.")

            self._target_unit_id = unit_id

        elif action_type in [
            ActionTypes.CANCELLED,
            ActionTypes.COMPLETED
        ]:
            assignment = Assignment.objects.filter(
                request=request_obj,
                status__in=[
                    AssignmentStatus.ACCEPTED
                ]
            ).first()
            if assignment:
                self.assignment = assignment

        return attrs

    def create(self, validated_data):
        request_obj = self.context.get("request_obj")
        user = self.context["request"].user

        action_type = validated_data["type"]

        with transaction.atomic():
            if action_type in [
                ActionTypes.CANCELLED,
            ]:
                if getattr(self, "assignment", None):
                    self.assignment.status = AssignmentStatus.CANCELLED
                    self.assignment.save(update_fields=["status"])

            elif action_type in [
                ActionTypes.COMPLETED,
            ]:
                if getattr(self, "assignment", None):
                    self.assignment.status = AssignmentStatus.COMPLETED
                    self.assignment.save(update_fields=["status"])

            elif action_type == ActionTypes.ACCEPT_FORWARDED:

                request_obj.academic_unit_id = self._target_unit_id
                request_obj.save(update_fields=["academic_unit"])

            return RequestAction.objects.create(
                created_by_id=user.id,
                updated_by_id=user.id,
                awaiting_decision=False,
                **validated_data
            )


class RequestActionAssignedSerializer(serializers.ModelSerializer):
    assigned_users = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        many=True,
        required=False
    )

    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)
    industry_mentor = serializers.CharField(
        required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = RequestAction
        fields = [
            "id",
            "type",
            "description",
            "assigned_users",
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

        if action_type not in ["assigned"]:
            return attrs

        assigned_users = attrs.get("assigned_users")
        start_date = attrs.get("start_date")
        end_date = attrs.get("end_date")

        # date validation
        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError(
                "End date must be after start date"
            )

        if action_type == ActionTypes.ASSIGNED:
            if not all([assigned_users, start_date, end_date]):
                raise serializers.ValidationError(
                    "Missing required assignment fields")
        return attrs

        return attrs

    def create(self, validated_data):
        request_obj = self.context.get("request_obj")
        user = self.context["request"].user
        action_type = validated_data.get("type")

        assigned_users = validated_data.pop("assigned_users", None)
        start_date = validated_data.pop("start_date", None)
        end_date = validated_data.pop("end_date", None)
        industry_mentor = validated_data.pop("industry_mentor", None)

        with transaction.atomic():

            assignment = Assignment.objects.filter(
                request=request_obj,
                assigned_users__in=assigned_users
            ).first()

            # -------------------------
            # UPDATE EXISTING ASSIGNMENT
            # -------------------------
            if assignment:
                assignment.start_date = start_date
                assignment.end_date = end_date
                assignment.industry_mentor = industry_mentor
                assignment.status = AssignmentStatus.PENDING
                assignment.updated_by_id = user.id
                assignment.save()

                if assigned_users is not None:
                    assignment.assigned_users.set(assigned_users)
                action = RequestAction.objects.create(
                    created_by_id=user.id,
                    awaiting_decision=True,
                    updated_by_id=user.id,
                    type=ActionTypes.ASSIGNED,
                    resulted_content_type=ContentType.objects.get_for_model(
                        Assignment),
                    resulted_object_id=assignment.id,
                    **validated_data
                )

                return action

            # -------------------------
            # CREATE NEW ASSIGNMENT
            # -------------------------
            elif action_type in [
                ActionTypes.ASSIGNED,
            ]:
                assignment = Assignment.objects.create(
                    request=request_obj,
                    start_date=start_date,
                    end_date=end_date,
                    industry_mentor=industry_mentor,
                    status=AssignmentStatus.PENDING,
                    created_by_id=user.id,
                    updated_by_id=user.id,
                )

                # attach M2M AFTER creation
                if assigned_users:
                    assignment.assigned_users.set(assigned_users)

                action = RequestAction.objects.create(
                    created_by_id=user.id,
                    updated_by_id=user.id,
                    awaiting_decision=True,
                    resulted_content_type=ContentType.objects.get_for_model(
                        Assignment),
                    resulted_object_id=assignment.id,
                    **validated_data
                )

                return action


class RequestActionPostedThematicSerializer(serializers.ModelSerializer):
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
            "description",
            "title",
            "content",
            "is_internal_only",
            "expires_at",
            "image",
        ]
        read_only_fields = ["id"]

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
                awaiting_decision=True,
                resulted_content_type=ContentType.objects.get_for_model(Post),
                resulted_object_id=post.id,
                **validated_data
            )

        return action


class RequestActionForwardedSerializer(serializers.ModelSerializer):
    target_unit = ForwardTarget(write_only=True)

    class Meta:
        model = RequestAction
        fields = ["id", "type", "description", "target_unit"]
        read_only_fields = ["id"]

    def validate(self, attrs):
        request_obj = self.context.get("request_obj")
        to_info = attrs.get("target_unit")

        if not to_info:
            raise serializers.ValidationError("This field is required.")

        target_ct = to_info['content_type']
        target_id = to_info['object_id']

        unit_ct = ContentType.objects.get(
            app_label="organizational_structure",
            model="organizationalunit"
        )

        if target_ct == unit_ct and str(target_id) == str(request_obj.academic_unit_id):
            raise serializers.ValidationError(
                "    Cannot forward to the same unit that owns the request."
            )

        return attrs

    def create(self, validated_data):
        to_info = validated_data.pop('target_unit')
        request_obj = self.context.get("request_obj")
        user = self.context["request"].user

        # Map generic fields
        validated_data['to_content_type'] = to_info['content_type']
        validated_data['to_object_id'] = to_info['object_id']
        validated_data['request'] = request_obj

        return RequestAction.objects.create(
            awaiting_decision=True,
            created_by_id=user.id,
            updated_by_id=user.id,
            **validated_data
        )


class RequestActionRepliedSerializer(serializers.ModelSerializer):

    from_entity = EntityReceiverField(write_only=True)
    to_entity = EntityReceiverField(write_only=True)

    class Meta:
        model = RequestAction
        fields = [
            "id",
            "type",
            "description",
            "from_entity",
            "to_entity",
        ]
        read_only_fields = ["id"]

    def validate(self, attrs):
        request_obj = self.context.get("request_obj")
        user = self.context["request"].user

        from_info = attrs.get('from_entity')
        to_info = attrs.get('to_entity')
        if from_info and to_info:
            is_same_type = from_info['content_type'] == to_info['content_type']
            if is_same_type:
                raise serializers.ValidationError(
                    "You cannot perform this action to yourself (source and destination are the same).")
        # staff or student
        if (from_info.get("entity") in [RequestingEntity.STAFF, RequestingEntity.STUDENT] or to_info.get("entity") in [RequestingEntity.STAFF, RequestingEntity.STUDENT]):
            if request_obj.requested_by_id != user.id:
                raise serializers.ValidationError(
                    "Only with or by  requester this action can performed.")
            staff_student_entities = {
                RequestingEntity.STAFF, RequestingEntity.STUDENT}
            if from_info.get("entity") in staff_student_entities:
                from_info["object_id"] = request_obj.requested_by_id
            if to_info.get("entity") in staff_student_entities:
                to_info["object_id"] = request_obj.requested_by_id
        # industry
        if (from_info.get("entity") == RequestingEntity.INDUSTRY or to_info.get("entity") == RequestingEntity.INDUSTRY):
            if from_info['entity'] == RequestingEntity.INDUSTRY:
                try:
                    industry = user.industry_profile
                    from_info["object_id"] = industry.id
                except (Industry.DoesNotExist, AttributeError):
                    raise serializers.ValidationError(
                        "there is no associated industry with this user")
            if to_info['entity'] == RequestingEntity.INDUSTRY:
                to_info["object_id"] = request_obj.industry.id
        # academic unit
        if (from_info.get("entity") == RequestingEntity.ACADEMIC_UNIT or to_info.get("entity") == RequestingEntity.ACADEMIC_UNIT):
            if from_info['entity'] == RequestingEntity.ACADEMIC_UNIT:
                from_info["object_id"] = request_obj.academic_unit.id
            if to_info['entity'] == RequestingEntity.ACADEMIC_UNIT:
                to_info["object_id"] = request_obj.academic_unit.id
        return attrs

    def create(self, validated_data):
        from_info = validated_data.pop('from_entity', None)
        to_info = validated_data.pop('to_entity', None)

        if from_info:
            validated_data['from_content_type'] = from_info['content_type']
            validated_data['from_object_id'] = from_info['object_id']

        if to_info:
            validated_data['to_content_type'] = to_info['content_type']
            validated_data['to_object_id'] = to_info['object_id']

        user = self.context["request"].user
        return RequestAction.objects.create(
            created_by_id=user.id,
            updated_by_id=user.id,
            awaiting_decision=False,

            **validated_data
        )


class AssignmentListSerializer(serializers.ModelSerializer):
    request = RequestSerializer(read_only=TRUE)
    supported_actions = serializers.SerializerMethodField()
    assigned_users = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Assignment
        fields = [
            "id",
            "request",
            "assigned_users",
            "start_date",
            "industry_mentor",
            "end_date",
            "status",
            "supported_actions"
        ]

    def get_supported_actions(self, obj):
        return get_assignment_supported_actions(obj.status)


class AssignmentDetailSerializer(serializers.ModelSerializer):
    request = RequestDetailSerializer(read_only=True)
    supported_actions = serializers.SerializerMethodField()
    assigned_users = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Assignment
        fields = [
            "id",
            "request",
            "assigned_users",
            "industry_mentor",
            "supported_actions",
            "start_date",
            "end_date",
            "status",
        ]

    def get_supported_actions(self, obj):
        return get_assignment_supported_actions(obj.status)


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


ACTION_SERIALIZERS = {
    "initiated": RequestActionGenericSerializer,
    "accept_forwarded": RequestActionGenericSerializer,
    "cancelled": RequestActionGenericSerializer,
    "rejected": RequestActionGenericSerializer,
    "completed": RequestActionGenericSerializer,

    "assigned": RequestActionAssignedSerializer,
    "posted_as_thematic": RequestActionPostedThematicSerializer,
    "forwarded": RequestActionForwardedSerializer,
    "replied": RequestActionRepliedSerializer,

}


CONTENT_TYPE_SERIALIZER_MAP = {
    "industry": IndustrySerializer,
    "user": UserSerializer,
    "assignment": AssignmentListSerializer,
    "post": PostListSerializer,
    "organizationalunit": OrganizationStructureListSerializer,
}
