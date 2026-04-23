from rest_framework import viewsets
from .models import Industry
from .serializers import IndustryCreateSerializer


class IndustryViewSet(viewsets.ModelViewSet):
    queryset = Industry.objects.all()
    serializer_class = IndustryCreateSerializer