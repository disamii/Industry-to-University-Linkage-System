from django.db import transaction
import re
from rest_framework.exceptions import ValidationError

from .models import RequestAction
from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .enums import ENTITY_MAP, RequestingEntity, ActionTypes


def clean_phone(value: str) -> str:
    return re.sub(r"\D", "", value)


def validate_action_or_raise(request, action_type):

    active_actions = request.actions.filter(is_active=True)

    if action_type == ActionTypes.INITIATED:
        if active_actions.filter(type=ActionTypes.INITIATED).exists():
            raise ValidationError(
                "Cannot initate. Request is already initiated."
            )

        if active_actions.filter(type=ActionTypes.FORWARDED).exists():
            raise ValidationError(
                "Already forwarded. revert that first."
            )

    elif action_type == ActionTypes.FORWARDED:
        if active_actions.filter(type=ActionTypes.ASSIGNED).exists():
            raise ValidationError(
                "Cannot forward. Request is currently assigned. Revoke first."
            )

        if active_actions.filter(type=ActionTypes.FORWARDED).exists():
            raise ValidationError(
                "Already forwarded. revert that first."
            )

    elif action_type == ActionTypes.ASSIGNED:
        if active_actions.filter(
            type__in=[
                ActionTypes.ASSIGNED,
                ActionTypes.REASSIGNED
            ]
        ).exists():
            raise ValidationError(
                "Already assigned. Revoke first."
            )

    elif action_type == ActionTypes.ACCEPT_FORWARDED:
        if not active_actions.filter(type=ActionTypes.FORWARDED).exists():
            raise ValidationError(
                "Cannot accept. No active forwarded request."
            )

    elif action_type == ActionTypes.REVOKED:

        if not active_actions.filter(
            type__in=[
                ActionTypes.ASSIGNED,
                ActionTypes.REASSIGNED,
            ]
        ).exists():
            raise ValidationError(
                "Cannot revoke. No active assignment "
            )

    elif action_type == ActionTypes.REASSIGNED:
        if active_actions.filter(
            type__in=[
                ActionTypes.ASSIGNED,
                ActionTypes.REASSIGNED
            ]
        ).exists():
            raise ValidationError(
                "Already assigned. Revoke first.")
    elif action_type == ActionTypes.POSTED_AS_THEMATIC:
        if active_actions.filter(
            type__in=[
                ActionTypes.FORWARDED
            ]
        ).exists():
            raise ValidationError(
                "Already forwarded. Revert that  first."
            )

        if active_actions.filter(
            type__in=[
                ActionTypes.ASSIGNED,
            ]
        ).exists():
            raise ValidationError(
                "Already assigned. Revoke first.")

        if active_actions.filter(
            type__in=[
                ActionTypes.POSTED_AS_THEMATIC
            ]
        ).exists():
            raise ValidationError("Already posted. Revert that  first.")


def deactivate_previous_actions(request_obj, action_type):
    qs = request_obj.actions.filter(is_active=True)

    if action_type == ActionTypes.ASSIGNED:
        qs.filter(
            type__in=[
                ActionTypes.ASSIGNED,
                ActionTypes.REASSIGNED,
            ]
        ).update(is_active=False)

    elif action_type == ActionTypes.FORWARDED:
        qs.filter(
            type=ActionTypes.FORWARDED
        ).update(is_active=False)

    elif action_type == ActionTypes.ACCEPT_FORWARDED:
        qs.filter(
            type=ActionTypes.FORWARDED
        ).update(is_active=False)

    elif action_type == ActionTypes.REVOKED:
        qs.filter(
            type__in=[
                ActionTypes.ASSIGNED,
                ActionTypes.REASSIGNED,
            ]
        ).update(is_active=False)

    elif action_type == ActionTypes.REASSIGNED:
        qs.filter(
            type__in=[
                ActionTypes.ASSIGNED,
                ActionTypes.REASSIGNED,
            ]
        ).update(is_active=False)


class ForwardTarget(serializers.Field):

    def to_internal_value(self, object_id):
        if not object_id:
            raise serializers.ValidationError(
                {"id": "'id' is required and must be a valid identifier."}
            )
        mapping = ENTITY_MAP[RequestingEntity.ACADEMIC_UNIT]
        content_type = ContentType.objects.get(
            app_label=mapping["app"],
            model=mapping["model"]
        )
        model_class = content_type.model_class()
        if not model_class.objects.filter(id=object_id).exists():
            raise serializers.ValidationError(
                {"id": f"ACADEMIC_UNIT with id={object_id} does not exist."}
            )
        return {
            "entity": RequestingEntity.ACADEMIC_UNIT,
            "content_type": content_type,
            "object_id": object_id
        }


class EntityReceiverField(serializers.Field):

    def to_internal_value(self, entity_constant):

        if entity_constant not in ENTITY_MAP:
            raise serializers.ValidationError(
                f"Invalid entity. Allowed values: {list(ENTITY_MAP.keys())}."
            )
        mapping = ENTITY_MAP[entity_constant]
        try:
            content_type = ContentType.objects.get(
                app_label=mapping["app"],
                model=mapping["model"]
            )
        except ContentType.DoesNotExist:
            raise serializers.ValidationError(
                f"{entity_constant} model not found."
            )
        model_class = content_type.model_class()
        if not model_class:
            raise serializers.ValidationError(
                f"model class for {entity_constant} not found."
            )
        return {
            "entity": entity_constant,
            "content_type": content_type,
        }


def revert_action_util(action, note=""):
    original_type = action.type

    with transaction.atomic():
        obj = action.resulted_object
        if obj:
            obj.delete()
        action.type = ActionTypes.REVERTED
        action.is_active = False
        action.description = (
            f"{action.description} | "
            f"REVERTED FROM: {original_type} | "
            f"NOTE: {note}"
        )
        action.resulted_object = None
        action.resulted_content_type = None
        action.resulted_object_id = None

        action.save(update_fields=[
            "type",
            "is_active",
            "description",
            "resulted_content_type",
            "resulted_object_id",
        ])

    return action
