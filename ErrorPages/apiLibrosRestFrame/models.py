from django.db import models

# Create your models here.
class Libroo(models.Model):
    titulo = models.CharField(max_length=40, blank=False,null=False)
    autor=models.CharField(max_length=50,blank=False,null=False)
    isbn=models.CharField(max_length=13,blank=False,null=False)
    paginas=models.PositiveIntegerField()
    editorial=models.CharField(max_length=40,blank=False,null=False)