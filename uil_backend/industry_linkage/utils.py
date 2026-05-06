import re
from rest_framework.exceptions import ValidationError
from  .models import RequestAction
from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType


def clean_phone(value: str) -> str:
    return re.sub(r"\D", "", value)


def validate_action_or_raise(request, action_type):

    active_actions = request.actions.filter(is_active=True)
    
    if action_type == RequestAction.ACTION_TYPES.INITIATED:
        if active_actions.filter(type=RequestAction.ACTION_TYPES.INITIATED).exists():
            raise ValidationError({
                "action": "Cannot initate. Request is already initiated."
            })

        if active_actions.filter(type=RequestAction.ACTION_TYPES.FORWARDED).exists():
            raise ValidationError({
                "action": "Already forwarded. revert that first."
            })

    elif action_type == RequestAction.ACTION_TYPES.FORWARDED:
        if active_actions.filter(type=RequestAction.ACTION_TYPES.ASSIGNED).exists():
            raise ValidationError({
                "action": "Cannot forward. Request is currently assigned. Revoke first."
            })

        if active_actions.filter(type=RequestAction.ACTION_TYPES.FORWARDED).exists():
            raise ValidationError({
                "action": "Already forwarded. revert that first."
            })

    elif action_type == RequestAction.ACTION_TYPES.ASSIGNED:
        if active_actions.filter(
            type__in=[
                RequestAction.ACTION_TYPES.ASSIGNED,
                RequestAction.ACTION_TYPES.REASSIGNED
            ]
        ).exists():
            raise ValidationError({
                "action": "Already assigned. Revoke first."
            })
    
    elif action_type == RequestAction.ACTION_TYPES.ACCEPT_FORWARDED:
            if not active_actions.filter(type=RequestAction.ACTION_TYPES.FORWARDED).exists():
                raise ValidationError({
                    "action": "Cannot accept. No active forwarded request."
                })

    elif action_type == RequestAction.ACTION_TYPES.REVOKED:
        
        if not active_actions.filter(
            type__in=[
                RequestAction.ACTION_TYPES.ASSIGNED,
                RequestAction.ACTION_TYPES.REASSIGNED,
            ]
        ).exists():
            raise ValidationError({
                "action": "Cannot revoke. No active assignment "
            })
            
    
    elif action_type==RequestAction.ACTION_TYPES.REASSIGNED:
        if active_actions.filter(
            type__in=[
                RequestAction.ACTION_TYPES.ASSIGNED,
                RequestAction.ACTION_TYPES.REASSIGNED
            ]
        ).exists():
            raise ValidationError({
                "action": "Already assigned. Revoke first."
            })
    elif action_type==RequestAction.ACTION_TYPES.POSTED_AS_THEMATIC:
        if active_actions.filter(
            type__in=[
                RequestAction.ACTION_TYPES.FORWARDED
            ]
        ).exists():
            raise ValidationError({
                "action": "Already forwarded. Revert that  first."
            })

        if active_actions.filter(
            type__in=[
                RequestAction.ACTION_TYPES.ASSIGNED,
            ]
        ).exists():
            raise ValidationError({
                "action": "Already assigned. Revoke first."
            })

        if active_actions.filter(
            type__in=[
                RequestAction.ACTION_TYPES.POSTED_AS_THEMATIC
            ]
        ).exists():
            raise ValidationError({
                "action": "Already posted. Revert that  first."
            })


def deactivate_previous_actions(request_obj, action_type):
    qs = request_obj.actions.filter(is_active=True)

    if action_type == RequestAction.ACTION_TYPES.ASSIGNED:
        qs.filter(
            type__in=[
                RequestAction.ACTION_TYPES.ASSIGNED,
                RequestAction.ACTION_TYPES.REASSIGNED,
            ]
        ).update(is_active=False)

    elif action_type == RequestAction.ACTION_TYPES.FORWARDED:
        qs.filter(
            type=RequestAction.ACTION_TYPES.FORWARDED
        ).update(is_active=False)

    elif action_type == RequestAction.ACTION_TYPES.ACCEPT_FORWARDED:
        qs.filter(
            type=RequestAction.ACTION_TYPES.FORWARDED
        ).update(is_active=False)

    elif action_type == RequestAction.ACTION_TYPES.REVOKED:
        qs.filter(
            type__in=[
                RequestAction.ACTION_TYPES.ASSIGNED,
                RequestAction.ACTION_TYPES.REASSIGNED,
            ]
        ).update(is_active=False)

    elif action_type == RequestAction.ACTION_TYPES.REASSIGNED:
        qs.filter(
            type__in=[
                RequestAction.ACTION_TYPES.ASSIGNED,
                RequestAction.ACTION_TYPES.REASSIGNED,
            ]
        ).update(is_active=False)
        

class ForwardTarget(serializers.Field):

    ENTITY_MAP = {
        "STAFF": {"app": "auth", "model": "user"},
        "STUDENT": {"app": "auth", "model": "user"},
        "INDUSTRY": {"app": "industry_linkage", "model": "industry"},
        "ACADEMIC_UNIT": {"app": "organizational_structure", "model": "organizationalunit"},
    }
    def to_internal_value(self, object_id):
        if not object_id:
            raise serializers.ValidationError(
                {"id": "'id' is required and must be a valid identifier."}
            )
        mapping = self.ENTITY_MAP["ACADEMIC_UNIT"]
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
            "entity":"ACADEMIC_UNIT",
            "content_type": content_type,
            "object_id": object_id
        }


class EntityReceiverField(serializers.Field):

    ENTITY_MAP = {
        "STAFF": {"app": "auth", "model": "user"},
        "STUDENT": {"app": "auth", "model": "user"},
        "INDUSTRY": {"app": "industry_linkage", "model": "industry"},
        "ACADEMIC_UNIT": {"app": "organizational_structure", "model": "organizationalunit"},
    }

    def to_internal_value(self, entity_constant):

        if entity_constant not in self.ENTITY_MAP:
            raise serializers.ValidationError(
                f"Invalid entity. Allowed values: {list(self.ENTITY_MAP.keys())}."
            )

        mapping = self.ENTITY_MAP[entity_constant]

        try:
            content_type = ContentType.objects.get(
                app_label=mapping["app"],
                model=mapping["model"]
            )
        except ContentType.DoesNotExist:
            raise serializers.ValidationError(
                f"Internal configuration error: {entity_constant} model not found."
            )
        model_class = content_type.model_class()
        if not model_class:
            raise serializers.ValidationError(
                f"Internal configuration error: model class for {entity_constant} not found."
            )
        return {
            "entity":entity_constant,
            "content_type": content_type,
        }