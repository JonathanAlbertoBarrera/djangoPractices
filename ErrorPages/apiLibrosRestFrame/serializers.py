from rest_framework import serializers
from .models import Libroo  # <--- Aquí va el o los modelos a serializar

class LibroSerializer(serializers.ModelSerializer):
    # Campos virtuales, de apoyo
    foto_para_binario = serializers.ImageField(write_only=True, required=False)
    foto_base64_display = serializers.ReadOnlyField(source='foto_base64')

    class Meta:
        model = Libroo
        fields = [
            'id', 'titulo', 'autor', 'isbn', 'paginas', 'editorial',
            'foto', 'foto_para_binario', 'foto_base64_display'
        ]

    def create(self, validated_data):
        archivo_binario = validated_data.pop('foto_para_binario', None)
        libro = Libroo.objects.create(**validated_data)
        if archivo_binario:
            libro.foto_binaria = archivo_binario.read()
            libro.save()
        return libro

    def update(self, instance, validated_data):
        archivo_binario = validated_data.pop('foto_para_binario', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if archivo_binario:
            instance.foto_binaria = archivo_binario.read()
        instance.save()
        return instance