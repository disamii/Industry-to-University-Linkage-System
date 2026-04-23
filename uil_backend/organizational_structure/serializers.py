from rest_framework import serializers
from .models import OrganizationalUnit
from django.db.models import Count
 

class  OrganizationStructureDetailSerializer(serializers.ModelSerializer):
    parent = serializers.PrimaryKeyRelatedField(queryset=OrganizationalUnit.objects.all(), allow_null=True)
    hierarchy = serializers.SerializerMethodField()
    leaf_descendants = serializers.SerializerMethodField()
    total_subnodes = serializers.SerializerMethodField()

    class Meta:
        model = OrganizationalUnit
        fields = [
            'id', 'name', 'unit_type', 'parent', 'abbreviation','leaf_descendants',
            'created_at', 'description', 'updated_at', 'created_by', 'updated_by',
            'hierarchy', 'total_subnodes'
        ]
        read_only_fields = [
            'created_at', 'updated_at', 'created_by', 'updated_by',
            'hierarchy', 'total_subnodes'
        ]

    def get_hierarchy(self, obj):
        return [
            {
                'id': unit.id,
                'name': unit.name,
                'unit_type': unit.unit_type,
                'unit_type_display': unit.get_unit_type_display(),
            }
            for unit in obj.get_hierarchy()
        ]

    def get_leaf_descendants(self, obj):
        leaves = []
        for child in obj.subnodes.all():
            if child.is_leaf():
                leaves.append({
                    'id': child.id,
                    'name': child.name,
                    'unit_type': child.unit_type,
                    'unit_type_display': child.get_unit_type_display(),
                    'abbreviation':child.abbreviation,
                    'description':child.description,
                })
            else:
                leaves.extend([
                    {
                        'id': leaf.id,
                        'name': leaf.name,
                        'unit_type': leaf.unit_type,
                        'unit_type_display': leaf.get_unit_type_display(),
                        'abbreviation':child.abbreviation,
                        'description':child.description,
                    }
                    for leaf in child.get_leaf_descendants()
                ])
        return leaves



    def get_total_subnodes(self, obj):
        return len(obj.get_all_descendants())



class OrganizationStructureListSerializer(serializers.ModelSerializer):
    total_subnodes = serializers.SerializerMethodField()
    ancestors = serializers.SerializerMethodField()

    class Meta:
        model = OrganizationalUnit
        fields = [
            'id', 'name', 'unit_type', 'parent', 'abbreviation',
            'description', 'total_subnodes','ancestors',
        ]

    def get_total_subnodes(self, obj):
        return obj.get_direct_children_count()
    
    def get_ancestors(self, obj):
        hierarchy = obj.get_ancestors()
        return [
            {
                "id": node.id,
                "name": node.name,
                "unit_type": node.unit_type,

            }
            for node in hierarchy
        ]


class OrganizationStructurdeForProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationalUnit
        fields = ['id', 'name']


class OrgStructureSummarySerializer(serializers.ModelSerializer):
    direct_children_summary = serializers.SerializerMethodField()

    class Meta:
        model = OrganizationalUnit
        fields = ['id', 'name', 'unit_type','abbreviation', 'direct_children_summary']

    def get_direct_children_summary(self, obj):
        
        counts = obj.subnodes.values('unit_type').annotate(count=Count('id'))
        summary = {item['unit_type']: item['count'] for item in counts if item['count'] > 0}
        all_descendants = obj.get_all_descendants()
        research_center_count = sum(
            1 for unit in all_descendants if unit.unit_type == 'research_center'
        )
        if research_center_count > 0:
            summary['research_center'] = research_center_count
        return summary


class OrganizationStructureRootSerializer(serializers.ModelSerializer):
    direct_children_summary = serializers.SerializerMethodField()
    children = OrgStructureSummarySerializer(source='subnodes',many=True)

    class Meta:
        model = OrganizationalUnit
        fields = ['id', 'name', 'unit_type','abbreviation', 'direct_children_summary', 'children']

    def get_direct_children_summary(self, obj):
        counts = obj.subnodes.values('unit_type').annotate(count=Count('id'))
        summary = {item['unit_type']: item['count'] for item in counts if item['count'] > 0}

        # Special: research centers from ALL descendants (not just direct)
        all_descendants = obj.get_all_descendants()
        research_center_count = sum(
            1 for unit in all_descendants if unit.unit_type == 'research_center'
        )
        if research_center_count > 0:
            summary['research_center'] = research_center_count

        return summary




class TopResearcherSerializer(serializers.Serializer):
    id=serializers.IntegerField()
    name = serializers.CharField()
    affiliation = serializers.DictField()
    total_publications = serializers.IntegerField()
    total_indexed_publications = serializers.IntegerField()
    # total_citations = serializers.IntegerField()



class YearlyOutputSerializer(serializers.Serializer):
    year = serializers.IntegerField()
    total_publications = serializers.IntegerField()


class TopCitedPublicationSerializer(serializers.Serializer):
    id=serializers.UUIDField()
    title = serializers.CharField()
    publication_type = serializers.CharField()
    total_citations = serializers.IntegerField()


class TopUnitByPublicationsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    unit_name = serializers.CharField()
    unit_type = serializers.CharField()
    total_publications = serializers.IntegerField()


class PublicationTypeSerializer(serializers.Serializer):
    type_name = serializers.CharField()
    total_publications = serializers.IntegerField()


class TopJournalSerializer(serializers.Serializer):
    journal_name = serializers.CharField()
    total_publications = serializers.IntegerField()


class OrganizationalUnitAnalyticsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    unit_type = serializers.CharField()
    abbreviation = serializers.CharField(allow_null=True)
    
    overview = serializers.DictField()
    
    top_researchers = TopResearcherSerializer(many=True)
    yearly_output = YearlyOutputSerializer(many=True)
    top_cited_publications = TopCitedPublicationSerializer(many=True)
    top_units_by_publications = TopUnitByPublicationsSerializer(many=True)
    publication_types = PublicationTypeSerializer(many=True)
    top_journals = TopJournalSerializer(many=True)
