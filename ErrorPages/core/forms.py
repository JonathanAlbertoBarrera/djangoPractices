from django import forms
from django.core.exceptions import ValidationError
import re

class ContactoForm(forms.Form):
    nombre = forms.CharField(
        min_length = 3,
        widget= forms.TextInput(attrs={'class': 'form-control', 'placeholder' : 'Tu nombre','pattern' : '[a-zA-ZáéíóúÁÉÍÓÚ ]+','title':'Ingresa sólo letras'})
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'correo@ejemplo.com'})
    )
    mensaje = forms.CharField(
        widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 3})
    )

    # Validación de Backend
    def clean_mensaje(self):
        data = self.cleaned_data['mensaje']
        if "spam" in data.lower():
            raise ValidationError("No se permite contenido publicitario.")
        return data

    def clean_nombre(self):
        data = self.cleaned_data['nombre']
        if not re.match('^[a-zA-ZáéíóúÁÉÍÓÚ]+$', data):
            raise ValidationError("Ingresa sólo letras")
        return data
        