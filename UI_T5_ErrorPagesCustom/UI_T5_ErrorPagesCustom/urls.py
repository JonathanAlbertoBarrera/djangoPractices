from django.contrib import admin
from django.urls import path
from core import views as core
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', core.index, name='index'),
]


