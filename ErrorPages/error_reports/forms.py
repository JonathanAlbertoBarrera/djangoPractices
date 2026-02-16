from django import forms
from error_reports.models import ErrorReport

class ErrorForm(forms.ModelForm):

    class Meta:
        model=ErrorReport
        fields=['titulo','descripcion','tipo_error','url','metodo_http','ip_cliente']