import uuid
from django.db import models
from django.conf import settings
from audit.models import AuditMixin

# from .enums import Position

class OrganizationalUnit(AuditMixin,models.Model):
    UNIT_CHOICES = [
        ('university', 'University'),
        ('campus', 'Campus'),
        ('college', 'College'),
        ('institute', 'Institute'),
        ('faculty', 'Faculty'),
        ('school', 'School'),
        ('department', 'Department'),
        ('academy', 'Academy'),
        ('research_center', 'Research Center'),
        ('support_unit', 'Support Unit'),
        ('program', 'Program'),
        ('office', 'Office'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=255)
    abbreviation = models.CharField(max_length=50, blank=True, null=True)
    unit_type = models.CharField(max_length=30, choices=UNIT_CHOICES)
    description = models.TextField(blank=True, null=True)

    parent = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='subnodes'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_organization_structures',
        null=True,   
        blank=True
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='updated_organization_structures',
        null=True,   
        blank=True
    )

    class Meta:
        verbose_name = "Organization Structure"
        verbose_name_plural = "Organization Structures"
        ordering = ['unit_type', 'name']
        unique_together = ('name', 'parent')

    def __str__(self):
        return f"{self.get_unit_type_display()} - {self.name}"

    def get_hierarchy(self):
        """
        Returns a list representing the hierarchy from top to this unit.
        Example: [University, College, Faculty, Department]
        """
        node = self
        hierarchy = []
        while node:
            hierarchy.insert(0, node)
            node = node.parent
        return hierarchy
    def get_ancestors(self):
        """
        Returns a list of ancestors from top to the direct parent.
        Example: [University, College, Faculty]
        """
        node = self.parent
        hierarchy = []

        while node:
            hierarchy.insert(0, node)
            node = node.parent

        return hierarchy

    def is_top_level(self):
        """Return True if this unit has no parent."""
        return self.parent is None

    def is_leaf(self):
        """Returns True if this unit has no subnodes"""
        return not self.subnodes.exists()

    def get_children(self):
        """Return direct child units."""
        return self.subnodes.all()

    def get_all_descendants(self):
        """Recursively return all descendants in the hierarchy."""
        descendants = []
        for child in self.subnodes.all():
            descendants.append(child)
            descendants.extend(child.get_all_descendants())
        return descendants
    def get_leaf_descendants(self):
        leaves = []
        for child in self.subnodes.all():
            if child.is_leaf():
                leaves.append(child)
            else:
                leaves.extend(child.get_leaf_descendants())
        return leaves

    def get_direct_children_count(self):
        """
        Returns the number of direct child units.
        """
        return self.subnodes.count()

    def is_descendant_of(self, ancestor) -> bool:
        from .models import OrganizationalUnit
        if isinstance(ancestor, int):
            try:
                ancestor = OrganizationalUnit.objects.get(id=ancestor)
            except OrganizationalUnit.DoesNotExist:
                return False

        node = self
        while node:
            if node == ancestor:
                return True
            node = node.parent
        return False


