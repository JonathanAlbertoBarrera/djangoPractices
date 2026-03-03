from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LibroViewSet

# Creamos el router y registramos nuestro ViewSet
router = DefaultRouter()
router.register(r'libros', LibroViewSet, basename='libro')

urlpatterns = [
    # Incluimos todas las rutas generadas por el router
    path('', include(router.urls)), 
]