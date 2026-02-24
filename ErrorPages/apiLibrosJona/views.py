from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Libro

# 1. LISTAR (GET)
def api_lista_libros(request):
    libros = Libro.objects.all().values()  
    return JsonResponse(list(libros), safe=False)

# 2. CREAR (POST)
@csrf_exempt
def api_crear_libro(request):
    if request.method == 'POST':
        # Intentamos leer datos de un formulario tradicional o un JSON
        titulo = request.POST.get('titulo')
        autor = request.POST.get('autor')
        isbn = request.POST.get('isbn')
        paginas = request.POST.get('paginas')
        editorial = request.POST.get('editorial')
        
        libro = Libro.objects.create(titulo=titulo,autor=autor,isbn=isbn,paginas=paginas,editorial=editorial)
        return JsonResponse({
            'mensaje': 'Libro creado',
            'id': libro.id
        }, status=201)

# 3. ACTUALIZAR (PUT/POST)
@csrf_exempt
def api_editar_libro(request, pk):
    libro = get_object_or_404(Libro, pk=pk)

    if request.method == "PUT":
        data = json.loads(request.body)

        libro.titulo = data.get("titulo", libro.titulo)
        libro.autor = data.get("autor", libro.autor)
        libro.isbn = data.get("isbn", libro.isbn)
        libro.paginas = data.get("paginas", libro.titulo)
        libro.editorial = data.get("editorial", libro.titulo)
        libro.save()

        return JsonResponse({"mensaje": "Libro actualizado"})

    return JsonResponse({"error": "Método no permitido"}, status=405)

# 4. ELIMINAR (DELETE)
@csrf_exempt
def api_eliminar_libro(request, pk):
    if request.method == 'DELETE':
        mascota = get_object_or_404(Libro, pk=pk)
        mascota.delete()
        return JsonResponse({'mensaje': 'Libro eliminado'}, status=204)