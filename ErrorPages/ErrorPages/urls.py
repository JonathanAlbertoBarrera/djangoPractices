from django.contrib import admin
from django.urls import path
from core import views as core
from error_reports import views as error_reports
from registro import views as registro

urlpatterns = [
    path('', core.index, name='index'),
    path('contacto/', core.contacto, name='contacto'),
    path('onepage/', core.onepage, name='onepage'),
    path('cvjona/', core.cvjona, name='cvjona'),
    path('equipos/', core.onepagefut, name='equipos'),
    path('formulario/', core.contacto_view, name='formulario'),
    path('registro/', registro.registro_view, name='registro'),
    path('obtener-reportes/', error_reports.obtener_reportes_view, name='obtener_reportes'),
    path('reportes-error/', error_reports.reporte_error_view, name='reportes_error'),
]
