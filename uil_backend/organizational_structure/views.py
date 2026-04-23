import time
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Sum, Q
from django.core.cache import cache
from django.shortcuts import get_object_or_404
from datetime import datetime

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import AllowAny
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import NotAuthenticated, NotFound
from django.core.cache import cache
from organizational_structure.models import OrganizationalUnit
from authorization.permissions import HasRequiredPermissions, IsSuperAdmin
from authorization.utilis import get_scope
from .serializers import OrgStructureSummarySerializer, OrganizationStructureRootSerializer, OrganizationalUnitAnalyticsSerializer, OrganizationStructureDetailSerializer, OrganizationStructureListSerializer
from .paginations import DefaultPagination
CACHE_PREFIX = "unit_analytics"


class OrganizationStructureViewSet(viewsets.ModelViewSet):
    queryset = OrganizationalUnit.objects.all().order_by('id')
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    serializer_class = OrganizationStructureListSerializer
    filterset_fields = ['unit_type', 'parent__name', 'parent__id']
    ordering_fields = ['created_at', 'updated_at',
                       'parent_name', 'parent_id', 'name']
    search_fields = ['name']
    pagination_class = DefaultPagination

    def get_permissions(self):
        if self.action not in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsSuperAdmin]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.query_params.get('leaf_only') == 'true':
            queryset = queryset.annotate(
                child_count=Count('subnodes')).filter(child_count=0)
        if self.request.query_params.get("parent_only") == "true":
            queryset = queryset.filter(parent__isnull=True)
        return queryset

    @action(detail=False, methods=['get'], url_path='direct-children', permission_classes=[AllowAny])
    def direct_children(self, request):
        """
        If parent_id is provided -> return direct children
        If parent_id is NOT provided -> return top-level units
        """
        parent_id = request.query_params.get('parent_id')

        if parent_id:
            queryset = OrganizationalUnit.objects.filter(parent_id=parent_id)
        else:
            queryset = OrganizationalUnit.objects.filter(parent__isnull=True)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user,
                        updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    @action(detail=False, methods=['get'], url_path='summary-for-universities')
    def summary_for_universities(self, request):
        universities = OrganizationalUnit.objects.filter(
            unit_type='university')

        results = []
        for uni in universities:
            children_qs = uni.subnodes.all()
            serializer = OrganizationStructureRootSerializer(uni)
            data = serializer.data
            children_serializer = OrgStructureSummarySerializer(
                children_qs, many=True)
            data['children'] = children_serializer.data
            results.append(data)

        return Response(results)


class OrganizationStructureScopeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OrganizationalUnit.objects.all().order_by('id')
    serializer_class = OrganizationStructureListSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['unit_type', 'parent__name', 'parent__id']
    ordering_fields = ['created_at', 'updated_at',
                       'parent_name', 'parent_id', 'name']
    search_fields = ['name']
    pagination_class = DefaultPagination

    def get_permissions(self):
        self.required_permissions = ['view_organizationalunit']
        if self.action in ['list', 'retrieve']:
            permission_classes = [HasRequiredPermissions]
        else:
            permission_classes = [IsSuperAdmin]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            raise NotAuthenticated(
                "Authentication credentials were not provided")

        user_scope = get_scope(user, self.required_permissions)

        queryset = user_scope

        parent_unit_id = self.request.query_params.get("academic_unit_scope")
        if parent_unit_id:
            try:
                parent_unit = OrganizationalUnit.objects.get(
                    id=int(parent_unit_id))
            except OrganizationalUnit.DoesNotExist:
                return OrganizationalUnit.objects.none()
            if parent_unit not in user_scope:
                return OrganizationalUnit.objects.none()
            filter_scope = [parent_unit.id] + \
                [u.id for u in parent_unit.get_all_descendants()]
            queryset = queryset.filter(id__in=filter_scope)

        # Apply leaf_only / parent_only filters
        if self.request.query_params.get('leaf_only') == 'true':
            queryset = queryset.annotate(
                child_count=Count('subnodes')).filter(child_count=0)
        if self.request.query_params.get("parent_only") == "true":
            queryset = queryset.filter(parent__isnull=True)

        return queryset


# class OrganizationalUnitAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = OrganizationalUnit.objects.all()
#     serializer_class = OrganizationalUnitAnalyticsSerializer

#     def get_object(self):
#         """
#         this return a single object by id and if not id passed it return the the first parent
#         """
#         pk = self.kwargs.get('pk')
#         if pk is None:
#             root_unit = OrganizationalUnit.objects.filter(
#                 parent__isnull=True).first()
#             if not root_unit:
#                 raise NotFound("No root organizational unit found")
#             return root_unit
#         else:
#             return get_object_or_404(OrganizationalUnit, pk=pk)

#     def list(self, request, *args, **kwargs):
#         """
#         Override list to return root unit analytics when no ID specified
#         """
#         root_unit = self.get_object()
#         analytics_data = self.get_analytics_data(root_unit)
#         serializer = self.get_serializer(analytics_data)
#         return Response(serializer.data)

#     def get_analytics_data(self, unit):
#         """
#         Cached entry point for unit analytics.
#         """
#         cache_key = f"{CACHE_PREFIX}_{unit.id}"
#         cached_data = cache.get(cache_key)

#         if cached_data:
#             return cached_data

#         analytics_data = self._calculate_analytics(unit)
#         cache.set(cache_key, analytics_data, timeout=None)
#         return analytics_data

#     def _calculate_analytics(self, unit):

#         direct_children = unit.get_children()

#         child_descendant_map = {
#             child.id: [child.id] + [u.id for u in child.get_all_descendants()]
#             for child in direct_children
#         }

#         all_child_ids = [
#             unit.id] + [uid for ids in child_descendant_map.values() for uid in ids]

#         start = time.perf_counter()

#         t0 = time.perf_counter()
#         researchers_qs = self._get_researchers_queryset(all_child_ids)
#         print(f"_get_researchers_queryset: {time.perf_counter() - t0:.3f}s")

#         t0 = time.perf_counter()
#         papers_qs = self._get_papers_queryset(all_child_ids)
#         papers_list = list(papers_qs)
#         print(
#             f"_get_papers_queryset + list(): {time.perf_counter() - t0:.3f}s")

#         t0 = time.perf_counter()
#         overview = self._build_overview(all_child_ids, researchers_qs)
#         print(f"_build_overview: {time.perf_counter() - t0:.3f}s")

#         t0 = time.perf_counter()
#         top_researchers = self._get_top_researchers(researchers_qs)
#         print(f"_get_top_researchers: {time.perf_counter() - t0:.3f}s")

#         t0 = time.perf_counter()
#         yearly_output = self._get_yearly_output(papers_list)
#         print(f"_get_yearly_output: {time.perf_counter() - t0:.3f}s")

#         t0 = time.perf_counter()
#         top_cited_publications = self._get_top_cited_publications(papers_list)
#         print(f"_get_top_cited_publications: {time.perf_counter() - t0:.3f}s")

#         t0 = time.perf_counter()
#         top_units_by_publications = self._get_subunit_analytics(
#             direct_children, child_descendant_map)
#         print(f"_get_subunit_analytics: {time.perf_counter() - t0:.3f}s")

#         t0 = time.perf_counter()
#         publication_types = self._get_publication_types(papers_list)
#         print(f"_get_publication_types: {time.perf_counter() - t0:.3f}s")

#         t0 = time.perf_counter()
#         top_journals = self._get_top_journals(papers_list)
#         print(f"_get_top_journals: {time.perf_counter() - t0:.3f}s")

#         print(
#             f"TOTAL _calculate_analytics: {time.perf_counter() - start:.3f}s")
#         return {
#             'id': unit.id,
#             'name': unit.name,
#             'unit_type': unit.unit_type,
#             'abbreviation': getattr(unit, 'abbreviation', ''),
#             'overview': overview,
#             'top_researchers': top_researchers,
#             'yearly_output': yearly_output,
#             'top_cited_publications': top_cited_publications,
#             'top_units_by_publications': top_units_by_publications,
#             'publication_types': publication_types,
#             'top_journals': top_journals
#         }

#     def _get_researchers_queryset(self, unit_ids):
#         return (
#             ResearcherProfile.objects
#             .filter(user__academic_unit__in=unit_ids)
#             .annotate(
#                 publications=Count(
#                     'registeredcollaboratorrole__research_paper',
#                     filter=Q(
#                         registeredcollaboratorrole__status=RegisteredCollaboratorRole.APPROVED,
#                         registeredcollaboratorrole__collaborator__user__academic_unit__in=unit_ids
#                     ),
#                     distinct=True
#                 ),
#                 citations=Sum(
#                     'registeredcollaboratorrole__research_paper__citation_count',
#                     filter=Q(
#                         registeredcollaboratorrole__status=RegisteredCollaboratorRole.APPROVED,
#                         registeredcollaboratorrole__collaborator__user__academic_unit__in=unit_ids
#                     )
#                 ),
#                 indexed_publications=Count(
#                     'registeredcollaboratorrole__research_paper',
#                     filter=Q(
#                         registeredcollaboratorrole__status=RegisteredCollaboratorRole.APPROVED,
#                         registeredcollaboratorrole__collaborator__user__academic_unit__in=unit_ids,
#                         registeredcollaboratorrole__research_paper__paper_indexes__status='indexed'
#                     ),
#                     distinct=True
#                 )
#             )
#             .select_related('user', 'user__academic_unit')
#         )

#     def _get_papers_queryset(self, unit_ids):
#         return (
#             ResearchPaper.objects
#             .filter(registered_collabs__user__academic_unit__in=unit_ids,
#                     registered_collaborators__status=RegisteredCollaboratorRole.APPROVED,
#                     )
#             .select_related('publication_type')
#             .prefetch_related(
#                 'registered_collabs__user',
#                 'paper_indexes__index'
#             )
#             .distinct()
#         )

#     def _build_overview(self, unit_ids, researchers_qs):

#         papers_overview = ResearchPaper.objects.filter(
#             registered_collaborators__status=RegisteredCollaboratorRole.APPROVED,
#             registered_collabs__user__academic_unit__in=unit_ids

#         ).aggregate(
#             total_publications=Count('id', distinct=True),
#             total_citations=Sum('citation_count'),
#             total_indexed_publications=Count(
#                 'id',
#                 filter=Q(paper_indexes__status='indexed'),
#                 distinct=True
#             )
#         )

#         total_publications = papers_overview['total_publications'] or 0
#         total_citations = papers_overview['total_citations'] or 0

#         return {
#             'total_researchers': researchers_qs.count(),
#             'total_publications': total_publications,
#             'total_citations': total_citations,
#             'total_indexed_publications': papers_overview['total_indexed_publications'] or 0,
#             'avg_citations_per_paper': round(
#                 total_citations / total_publications, 2
#             ) if total_publications else 0
#         }

#     def _get_top_researchers(self, researchers_qs):
#         top_researchers = []

#         for r in researchers_qs.order_by('-publications', '-citations')[:10]:
#             affiliation = {}
#             current = r.user.academic_unit
#             level = 1

#             while current:
#                 affiliation[f"level_{level}"] = {
#                     "type": current.unit_type,
#                     "name": current.name
#                 }
#                 current = current.parent
#                 level += 1

#             top_researchers.append({
#                 'id': r.user.id,
#                 'name': f"{r.get_academic_title_display() if r.academic_title else ''} {r.user.get_full_name()}",
#                 'affiliation': affiliation,
#                 'total_publications': r.publications,
#                 'total_indexed_publications': r.indexed_publications,
#             })

#         return top_researchers

#     def _get_yearly_output(self, papers_list):
#         yearly_data = {}

#         for paper in papers_list:
#             if paper.publication_date:
#                 year = paper.publication_date.year
#                 yearly_data[year] = yearly_data.get(year, 0) + 1

#         return [
#             {'year': year, 'total_publications': count}
#             for year, count in sorted(yearly_data.items(), reverse=True)
#         ][:10]

#     def _get_top_cited_publications(self, papers_list):
#         return [
#             {
#                 "id": paper.id,
#                 "title": paper.title or "Untitled",
#                 "publication_type": paper.publication_type.name if paper.publication_type else "Unknown",
#                 "total_citations": paper.citation_count,
#             }
#             for paper in sorted(papers_list, key=lambda p: p.citation_count, reverse=True)[:10]
#         ]

#     def _get_subunit_analytics(self, direct_children, child_descendant_map):
#         stats = {}

#         for child in direct_children:
#             # Get all unit IDs in this branch (child + all its descendants)
#             descendant_ids = child_descendant_map.get(child.id, [])

#             # We filter Papers directly. A paper is "in" this unit if it has
#             # an APPROVED collaborator who belongs to one of these unit IDs.
#             unit_papers_qs = ResearchPaper.objects.filter(
#                 registered_collaborators__collaborator__user__academic_unit__in=descendant_ids,
#                 registered_collaborators__status=RegisteredCollaboratorRole.APPROVED
#             ).distinct()

#             total_publications = unit_papers_qs.count()

#             # Filter the already narrowed down unit_papers_qs for indexed ones
#             total_indexed_publications = unit_papers_qs.filter(
#                 paper_indexes__status='indexed'
#             ).count()

#             # We still need the researcher count for this unit
#             total_researchers = ResearcherProfile.objects.filter(
#                 user__academic_unit__in=descendant_ids
#             ).distinct().count()

#             if not (total_researchers or total_publications):
#                 continue  # skip empty rows

#             stats[child.id] = {
#                 'id': child.id,
#                 'unit_name': child.name,
#                 'unit_type': child.unit_type,
#                 'total_researchers': total_researchers,
#                 'total_publications': total_publications,
#                 'total_indexed_publications': total_indexed_publications,
#             }

#         return sorted(
#             stats.values(),
#             key=lambda x: x['total_publications'],
#             reverse=True
#         )[:10]

#     def _get_publication_types(self, papers_list):
#         type_stats = {}

#         for paper in papers_list:
#             name = paper.publication_type.name if paper.publication_type else 'Unknown'
#             type_stats[name] = type_stats.get(name, 0) + 1

#         return [
#             {'type_name': t, 'total_publications': c}
#             for t, c in sorted(type_stats.items(), key=lambda x: x[1], reverse=True)
#         ]

#     def _get_top_journals(self, papers_list):
#         journal_stats = {}

#         for paper in papers_list:
#             if paper.journal:
#                 journal_stats[paper.journal] = journal_stats.get(
#                     paper.journal, 0) + 1

#         return [
#             {'journal_name': j, 'total_publications': c}
#             for j, c in sorted(journal_stats.items(), key=lambda x: x[1], reverse=True)[:10]
#         ]

#     def retrieve(self, request, *args, **kwargs):
#         """
#         Override retrieve to return analytics data
#         """
#         unit = self.get_object()
#         analytics_data = self.get_analytics_data(unit)
#         serializer = self.get_serializer(analytics_data)
#         return Response(serializer.data)

#     @action(detail=True, methods=['get'])
#     def refresh_analytics(self, request, pk=None):
#         """
#         Force refresh analytics cache
#         """
#         unit = self.get_object()
#         cache_key = f"unit_analytics_{unit.id}_{datetime.now().strftime('%Y%m%d')}"
#         cache.delete(cache_key)

#         analytics_data = self.get_analytics_data(unit)
#         serializer = self.get_serializer(analytics_data)
#         return Response(serializer.data)
