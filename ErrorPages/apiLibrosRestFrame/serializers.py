from rest_framework import serializers
from .models import Libroo  # <--- Aquí va el o los modelos a serializar

class LibroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Libroo
        fields = '__all__'