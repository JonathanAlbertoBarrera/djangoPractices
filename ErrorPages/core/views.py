from django.shortcuts import render

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

def contacto_view(request):
    if request.method == 'POST':
        form = ContactoForm(request.POST)
        if form.is_valid():
            # Los datos ya pasaron las validaciones de front y back
            nombre = form.cleaned_data['nombre']
            email = form.cleaned_data['email']
            mensaje = form.cleaned_data['mensaje']
           
            print(f"--- NUEVO MENSAJE ---")
            print(f"Nombre: {nombre}\nEmail: {email}\nMensaje: {mensaje}")
           
            return render(request, 'core/formulario.html', {'form': form, 'success': True})
    else:
        form = ContactoForm()
   
    return render(request, 'core/formulario.html', {'form': form})