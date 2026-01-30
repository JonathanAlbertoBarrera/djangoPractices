from django import forms
from django.core.exceptions import ValidationError
import re

class RegisterForm(forms.Form):
    nombre = forms.CharField(
        required=True,
        min_length=10,
        widget=forms.TextInput(attrs={
            'class': 'form-control', 
            'placeholder': 'Escribe tu nombre completo',
            'pattern': '[a-zA-ZáéíóúÁÉÍÓÚñÑ ]{10,}',
            'title': 'Solo letras y espacios. Sin números ni símbolos. Mínimo 10 caracteres.',
            'required': 'required'
        })
    )

    matricula = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Escribe tu matricula',
            'pattern': r'\d{5}[a-zA-Z]{2}\d{3}',
            'title': '5 dígitos, 2 letras, 3 dígitos',
            'required': 'required'
        })
    )

    email = forms.CharField(
        required=True,
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Escribe tu correo institucional',
            'pattern': r'[a-zA-Z0-9._]+@utez\.edu\.mx',
            'title': 'Debe terminar en @utez.edu.mx',
            'required': 'required'
        })
    )

    telefono = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Escribe tu teléfono móvil',
            'pattern': r'\d{10}',
            'title': '10 dígitos sin espacios ni guiones',
            'required': 'required'
        })
    )

    rfc = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Ej: ABCD990101A12',
            'pattern': r'[A-Z]{4}\d{6}[A-Z0-9]{3}',
            'title': '4 letras mayúsculas, 6 números, 3 alfanuméricos (letras mayúsculas)',
            'required': 'required'
        })
    )

    password = forms.CharField(
        required=True,
        widget=forms.PasswordInput(render_value=True, attrs={
            'class': 'form-control',
            'placeholder': 'Contraseña segura',
            'pattern': r'(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}',
            'title': 'Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo (@$!%*?&)',
            'required': 'required'
        })
    )

    # Validaciones Backend
    def clean_nombre(self):
        nombre = self.cleaned_data['nombre']
        if len(nombre) < 10:
            raise ValidationError("El nombre debe tener al menos 10 caracteres.")
        if not re.match(r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$', nombre):
            raise ValidationError("Solo letras y espacios. Sin números ni símbolos.")
        return nombre

    def clean_matricula(self):
        matricula = self.cleaned_data['matricula']
        if not re.match(r'^\d{5}[a-zA-Z]{2}\d{3}$', matricula):
            raise ValidationError("Formato inválido: debe ser 5 dígitos, 2 letras y 3 dígitos.")
        return matricula

    def clean_email(self):
        email = self.cleaned_data['email']
        if not re.match(r'^[a-zA-Z0-9._]+@utez\.edu\.mx$', email):
            raise ValidationError("Debe ser un correo válido que termine en @utez.edu.mx")
        return email

    def clean_telefono(self):
        telefono = self.cleaned_data['telefono']
        if not re.match(r'^\d{10}$', telefono):
            raise ValidationError("Debe contener exactamente 10 dígitos sin espacios ni guiones.")
        return telefono

    def clean_rfc(self):
        rfc = self.cleaned_data['rfc']
        # Primero validar que no tenga minúsculas
        if not re.match(r'^[A-Z]{4}\d{6}[A-Z0-9]{3}$', rfc):
            raise ValidationError("RFC inválido. Debe tener 4 letras MAYÚSCULAS, 6 números, 3 alfanuméricos en mayúsculas. Ejemplo: ABCD990101A12")
        return rfc

    def clean_password(self):
        password = self.cleaned_data['password']
        if not re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', password):
            raise ValidationError("Debe tener mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un símbolo (@$!%*?&).")
        return password