from django.shortcuts import render
from .forms import RegisterForm

def registro_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            # Los datos ya pasaron las validaciones de front y back
            nombre = form.cleaned_data['nombre']
            matricula = form.cleaned_data['matricula']
            email = form.cleaned_data['email']
            telefono = form.cleaned_data['telefono']
            rfc = form.cleaned_data['rfc']
           
            print(f"--- NUEVO REGISTRO ---")
            print(f"Nombre: {nombre}")
            print(f"Matrícula: {matricula}")
            print(f"Email: {email}")
            print(f"Teléfono: {telefono}")
            print(f"RFC: {rfc}")
           
            return render(request, 'registro/registro.html', {'form': form, 'success': True})
    else:
        form = RegisterForm()
   
    return render(request, 'registro/registro.html', {'form': form})