import re
from rest_framework.exceptions import ValidationError
from  .models import RequestAction


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
        

