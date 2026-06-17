# Backend Django REST Framework — Watchlist de Filmes

Backend REST/JSON que o frontend Angular consome via `HttpClient`.

O frontend espera os endpoints (com **barra final**, padrão do DRF):

| Método | URL                                   | Operação   |
| ------ | ------------------------------------- | ---------- |
| GET    | `http://localhost:8000/api/filmes/`   | listar     |
| GET    | `http://localhost:8000/api/filmes/{id}/` | detalhar |
| POST   | `http://localhost:8000/api/filmes/`   | inserir    |
| PUT    | `http://localhost:8000/api/filmes/{id}/` | atualizar |
| DELETE | `http://localhost:8000/api/filmes/{id}/` | remover  |

---

## 1. Criar o projeto

```bash
# dentro da pasta backend/
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/Mac:
# source .venv/bin/activate

pip install django djangorestframework django-cors-headers

django-admin startproject config .
python manage.py startapp filmes
```

## 2. Modelo — `filmes/models.py`

```python
from django.db import models


class Filme(models.Model):
    titulo = models.CharField(max_length=100)   # string
    nota = models.IntegerField(default=0)        # number
    assistido = models.BooleanField(default=False)  # boolean

    def __str__(self):
        return self.titulo
```

> O `id` é criado automaticamente pelo Django (chave primária inteira) — combina com o `id: number` do modelo Angular.

## 3. Serializer — `filmes/serializers.py`

```python
from rest_framework import serializers
from .models import Filme


class FilmeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filme
        fields = ['id', 'titulo', 'nota', 'assistido']
```

## 4. ViewSet — `filmes/views.py`

```python
from rest_framework import viewsets
from .models import Filme
from .serializers import FilmeSerializer


class FilmeViewSet(viewsets.ModelViewSet):
    queryset = Filme.objects.all().order_by('id')
    serializer_class = FilmeSerializer
```

> O `ModelViewSet` já entrega listar, detalhar, inserir, atualizar e remover.

## 5. Rotas — `config/urls.py`

```python
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from filmes.views import FilmeViewSet

router = DefaultRouter()
router.register(r'filmes', FilmeViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
```

> O `DefaultRouter` gera as URLs `/api/filmes/` e `/api/filmes/{id}/` com barra final.

## 6. Configurações — `config/settings.py`

```python
INSTALLED_APPS = [
    # ... apps padrão do Django ...
    'rest_framework',
    'corsheaders',
    'filmes',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # o mais alto possível
    'django.middleware.common.CommonMiddleware',
    # ... resto do middleware ...
]

# Libera o frontend Angular (ng serve roda em 4200) a chamar a API
CORS_ALLOWED_ORIGINS = [
    'http://localhost:4200',
]
```

## 7. Migrar e rodar

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 8000
```

A API fica em `http://localhost:8000/api/filmes/`.

## 8. (Opcional) Dados iniciais

Com o servidor no ar, dá pra popular via DRF browsable API (`http://localhost:8000/api/filmes/`)
ou via shell:

```bash
python manage.py shell
```
```python
from filmes.models import Filme
Filme.objects.create(titulo='O Senhor dos Anéis: A Sociedade do Anel', nota=10, assistido=True)
Filme.objects.create(titulo='Duna: Parte Dois', nota=9, assistido=True)
Filme.objects.create(titulo='Oppenheimer', nota=8, assistido=False)
Filme.objects.create(titulo='Interestelar', nota=10, assistido=True)
```

---

## Por que CORS?

`ng serve` serve o frontend em `localhost:4200` e o Django roda em `localhost:8000`.
São origens diferentes, então o navegador bloqueia as chamadas a menos que o backend
autorize via `django-cors-headers` (passo 6). Mesmo rodando tudo na mesma máquina,
as portas diferentes exigem essa liberação.
```
