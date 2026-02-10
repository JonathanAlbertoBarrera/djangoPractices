from django.shortcuts import render
from core.models import Contacto

# Create your views here.
def index(request):
    return render(request, "core/index.html")

def contacto(request):
    print("Log el usuario entro al contacto")
    return render(request, "core/contacto.html")

def onepage(request):
    return render(request, "core/onepage.html")

def cvjona(request):
    return render(request, "core/cvjona.html")

def onepagefut(request):
    return render(request, "core/onepagefut.html")

from django.shortcuts import render
from .forms import ContactoForm
from django.http import JsonResponse

def contacto_view(request):
    todos= Contacto.objects.all()
    if request.method == 'POST':
        form = ContactoForm(request.POST)
        if form.is_valid():
            # Los datos ya pasaron las validaciones de front y back
            form.save()
            return JsonResponse({
                'status':'ok',
                'mensaje':'Registro exitoso!'
                })
        else:
            return JsonResponse({
                'status':'error',
                'mensaje': 'algo saloo mal',
                'errors':form.errors
            },status=400)
    else:
        form = ContactoForm()
   
    return render(request, 'core/formulario.html', {'form': form,'contactos':todos})