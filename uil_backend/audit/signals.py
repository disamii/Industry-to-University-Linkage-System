# audit/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import ActivityLog
from industry_linkage.models import Industry, Request, Assignment


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
def assignment_status_change(sender, instance, created, **kwargs):
    if not created:
        log(
            actor=instance.assigned_user,
            action_type="status_change",
            instance=instance,
            message=f"Assignment status changed to {instance.status}",
            metadata={"status": instance.status}
        )