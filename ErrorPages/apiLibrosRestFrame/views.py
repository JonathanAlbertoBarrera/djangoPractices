from django.shortcuts import render

from rest_framework import viewsets
from .models import Libroo
from .serializers import LibroSerializer # <-- El serializador del modelo

class LibroViewSet(viewsets.ModelViewSet):
    queryset = Libroo.objects.all()
    serializer_class = LibroSerializer
