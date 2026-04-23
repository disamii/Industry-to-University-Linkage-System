from typing import List

from django.shortcuts import get_object_or_404
from organizational_structure.models import OrganizationalUnit
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

def get_scope(user: User, permission_codes: List[str]):
    if user.is_superuser:
        return OrganizationalUnit.objects.all()

    base_units = OrganizationalUnit.objects.filter(
        user_roles__user=user,
        user_roles__role__role_permissions__permission__code__in=permission_codes
    ).distinct()

    q_filter = Q()
    for unit in base_units:
        q_filter |= Q(pk=unit.pk)
        descendant_ids = [desc.pk for desc in unit.get_all_descendants()]
        if descendant_ids:
            q_filter |= Q(pk__in=descendant_ids)

    return OrganizationalUnit.objects.filter(q_filter).distinct()


def get_parent_scope(user: User, permission_codes: list[str]):
    if user.is_superuser:
        return OrganizationalUnit.objects.filter(parent__isnull=True)

    return OrganizationalUnit.objects.filter(
        user_roles__user=user,
        user_roles__role__role_permissions__permission__code__in=permission_codes
    ).distinct()


def get_scope_with_parent(parent_unit_id: int):
    try:
        parent_unit = OrganizationalUnit.objects.get(id=parent_unit_id)
    except OrganizationalUnit.DoesNotExist:
        return OrganizationalUnit.objects.none()

    scope_units = [parent_unit.id] + [u.id for u in parent_unit.get_all_descendants()]
    return OrganizationalUnit.objects.filter(id__in=scope_units)


# def get_registered_collabs_units(paper_id):
#     from research_paper.models import ResearchPaper
#     from organizational_structure.models import OrganizationalUnit  

#     paper = get_object_or_404(ResearchPaper, id=paper_id)
#     unit_ids = paper.registered_collabs.values_list('user__academic_unit', flat=True)
#     return list(OrganizationalUnit.objects.filter(id__in=unit_ids))


# def is_approved_author(user, research_paper_id) -> bool:
#     return RegisteredCollaboratorRole.objects.filter(
#         research_paper_id=research_paper_id,
#         collaborator__user=user,
#         status=RegisteredCollaboratorRole.APPROVED,
#     ).exists()
    
# def get_registered_collab_unit(paper_author_id):
#     from research_paper.models import RegisteredCollaboratorRole
#     from organizational_structure.models import OrganizationalUnit
#     from django.shortcuts import get_object_or_404

#     paper_author = get_object_or_404(RegisteredCollaboratorRole, id=paper_author_id)
#     unit = paper_author.collaborator.user.academic_unit  # <- fixed
#     return [unit] if unit else []

# def get_researcher_profile_academic_unit(profile_id):
#     from research_paper.models import ResearcherProfile

#     try:
#         profile = ResearcherProfile.objects.select_related('user__academic_unit').get(id=profile_id)
#         return profile.user.academic_unit
#     except ResearcherProfile.DoesNotExist:
#         return None
    
    
def is_unit_in_user_scope(
    user: User,
    permission_codes: list[str],
    academic_unit_id: int,
) -> bool:


    if user.is_superuser:
        return OrganizationalUnit.objects.filter(id=academic_unit_id).exists()

    base_units = OrganizationalUnit.objects.filter(
        user_roles__user=user,
        user_roles__role__role_permissions__permission__code__in=permission_codes,
    ).distinct()

    if not base_units.exists():
        return False

    if base_units.filter(id=academic_unit_id).exists():
        return True

    # Descendant match
    for unit in base_units:
        if unit.get_all_descendants().filter(id=academic_unit_id).exists():
            return True

    return False