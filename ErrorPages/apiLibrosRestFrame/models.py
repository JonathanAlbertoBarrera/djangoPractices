import base64

from django.db import models

# Create your models here.
class Libroo(models.Model):
    titulo = models.CharField(max_length=40, blank=False,null=False)
    autor=models.CharField(max_length=50,blank=False,null=False)
    isbn=models.CharField(max_length=13,blank=False,null=False)
    paginas=models.PositiveIntegerField()
    editorial=models.CharField(max_length=40,blank=False,null=False)

    # CAMPO PARA GUARDAR LA IMAGEN EN EL BACK (carpeta media)
    foto = models.ImageField(upload_to='libros/', blank=True, null=True)

    # CAMPO BINARIO PARA LA IMAGEN EN LA BD
    foto_binaria = models.BinaryField(blank=True, null=True)

    def __str__(self):
        return f"{self.titulo} - {self.autor}"

    @property
    def foto_base64(self):
        if self.foto_binaria:
            codificado = base64.b64encode(self.foto_binaria).decode('utf-8')
            return f"data:image/jpeg;base64,{codificado}"
        return None