from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from django.conf import settings
from django.conf.urls.static import static

from bibliotecaapp.views import (
    ProductoViewSet,
    CategoriaViewSet,
    UsuarioViewSet,
    PedidoViewSet,
    comprar
)

# ======================
# ROUTER
# ======================
router = DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'pedidos', PedidoViewSet)

# ======================
# URLS
# ======================
urlpatterns = [
    path('admin/', admin.site.urls),

    # API REST
    path('api/', include(router.urls)),

    # LOGIN TOKEN
    path('api/login/', obtain_auth_token),

    # COMPRA
    path('api/comprar/', comprar),
]

# ======================
# MEDIA (IMÁGENES)
# ======================
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)