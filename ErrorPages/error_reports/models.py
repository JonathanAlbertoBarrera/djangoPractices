from django.db import models

# Create your models here.
class ErrorReport(models.Model):
    titulo= models.CharField(max_length=150)
    descripcion=models.TextField(blank=False,null=False)
    tipo_error=models.CharField(max_length=100,blank=False,null=False)
    url=models.URLField(blank=False,null=False)
    metodo_http=models.CharField(max_length=10)
    ip_cliente=models.GenericIPAddressField(blank=True,null=True)
    fecha_reporte=models.DateTimeField(auto_now_add=True)
    activo=models.BooleanField(default=True)