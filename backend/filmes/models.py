from django.db import models


class Filme(models.Model):
    titulo = models.CharField(max_length=100)   # string
    nota = models.IntegerField(default=0)        # number
    assistido = models.BooleanField(default=False)  # boolean

    def __str__(self):
        return self.titulo