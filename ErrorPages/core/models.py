from django.db import models

# Create your models here.
class Contacto(models.Model):
    nombre = models.CharField(max_length=100)
    apellidos=models.CharField(max_length=100,null=False, default='')
    edad=models.IntegerField()
    email=models.EmailField()
    mensaje=models.TextField()