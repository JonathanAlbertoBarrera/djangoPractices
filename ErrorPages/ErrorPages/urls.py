from django.contrib import admin
from django.urls import path
from core import views as core

urlpatterns = [
    path('', core.index, name='index'),
    path('contacto/', core.contacto, name='contacto'),
    path('onepage/', core.onepage, name='onepage'),
    path('cvjona/', core.cvjona, name='cvjona'),
]
