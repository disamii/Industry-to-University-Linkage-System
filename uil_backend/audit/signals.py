# audit/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import ActivityLog
from industry_linkage.models import Industry, Request, Assignment,RequestAction
from bulletin.models import Post
from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from django.contrib.auth import get_user_model

User = get_user_model()

def log(actor, action_type, instance, message, metadata=None):
    ActivityLog.objects.create(
        actor=actor,
        action_type=action_type,
        content_type=instance.__class__.__name__,
        object_id=instance.id,
        message=message,
        metadata=metadata or {}
    )


@receiver(post_save, sender=Industry)
def industry_created(sender, instance, created, **kwargs):
    if created:
        log(
            actor=instance.contact_person,
            action_type="create",
            instance=instance,
            message=f"New industry registered: {instance.name}"
        )


@receiver(post_save, sender=Request)
def request_created(sender, instance, created, **kwargs):
    if created:
        log(
            actor=None,
            action_type="create",
            instance=instance,
            message=f"New request created: {instance.title}"
        )


@receiver(post_save, sender=Assignment)
def assignment_changed(sender, instance, created, **kwargs):
    actor = instance.updated_by or instance.created_by

    if created:
        log(
            actor=actor,
            action_type="create",
            instance=instance,
            message=f"Assignment created for request #{instance.request_id}",
            metadata={
                "status": instance.status
            }
        )

        return

    try:
        old_instance = Assignment.objects.get(pk=instance.pk)
    except Assignment.DoesNotExist:
        return

    # compare old vs new
    if old_instance.status != instance.status:

        log(
            actor=actor,
            action_type="status_change",
            instance=instance,
            message=(
                f"Assignment status changed "
                f"from {old_instance.status} "
                f"to {instance.status}"
            ),
            metadata={
                "old_status": old_instance.status,
                "new_status": instance.status,
            }
        )
@receiver(m2m_changed, sender=Assignment.assigned_users.through)
def assignment_members_changed(
    sender,
    instance,
    action,
    pk_set,
    **kwargs
):

    users = User.objects.filter(id__in=pk_set)

    user_names = list(
        users.values_list("first_name", flat=True)
    )

    actor = instance.updated_by or instance.created_by

    # ==========================================
    # Users Added
    # ==========================================
    if action == "post_add":

        log(
            actor=actor,
            action_type="member_added",
            instance=instance,
            message=(
                f"Users added to assignment: "
                f"{', '.join(user_names)}"
            ),
            metadata={
                "user_ids": list(pk_set),
                "status": instance.status,
            }
        )

    # ==========================================
    # Users Removed
    # ==========================================
    elif action == "post_remove":

        log(
            actor=actor,
            action_type="member_removed",
            instance=instance,
            message=(
                f"Users removed from assignment: "
                f"{', '.join(user_names)}"
            ),
            metadata={
                "user_ids": list(pk_set),
                "status": instance.status,
            }
        )


@receiver(post_save, sender=RequestAction)
def request_action_changed(sender, instance, created, **kwargs):

    actor = instance.created_by or instance.updated_by

    if created:
        log(
            actor=actor,
            action_type="create",
            instance=instance,
            message=f"Request action created: {instance.type}",
            metadata={
                "request_id": instance.request_id,
                "action_type": instance.type,
                "awaiting_decision": instance.awaiting_decision,
            }
        )

    else:
        log(
            actor=actor,
            action_type="update",
            instance=instance,
            message=f"Request action updated: {instance.type}",
            metadata={
                "request_id": instance.request_id,
                "action_type": instance.type,
                "awaiting_decision": instance.awaiting_decision,
            }
        )


@receiver(post_save, sender=Post)
def post_changed(sender, instance, created, **kwargs):

    actor = instance.created_by or instance.updated_by

    if created:
        log(
            actor=actor,
            action_type="create",
            instance=instance,
            message=f"New post created: {instance.title}",
            metadata={
                "post_type": instance.post_type,
                "published": instance.is_published,
            }
        )

    else:
        log(
            actor=actor,
            action_type="update",
            instance=instance,
            message=f"Post updated: {instance.title}",
            metadata={
                "post_type": instance.post_type,
                "published": instance.is_published,
            }
        )
    