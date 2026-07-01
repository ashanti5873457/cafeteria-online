from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static

from bibliotecaapp.views import (
    ProductoViewSet,
    CategoriaViewSet,
    UsuarioViewSet,
    PedidoViewSet,
    comprar
)

# JWT IMPORT (FUERA de urlpatterns)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
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
# URLS PRINCIPALES
# ======================
urlpatterns = [
    path('admin/', admin.site.urls),

    # API REST
    path('api/', include(router.urls)),

    # LOGIN JWT
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # COMPRA
    path('api/comprar/', comprar),
]

# ======================
# MEDIA (IMÁGENES)
# ======================
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)