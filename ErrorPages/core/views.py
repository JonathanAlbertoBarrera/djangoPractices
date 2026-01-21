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