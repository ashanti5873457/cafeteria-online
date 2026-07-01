from django.urls import path, include
from rest_framework.routers import DefaultRouter
from bibliotecaapp.views import comprar
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

from bibliotecaapp.views import (
    ProductoViewSet,
    CategoriaViewSet,
    UsuarioViewSet,
    PedidoViewSet
)

router = DefaultRouter()

router.register(r'productos', ProductoViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'pedidos', PedidoViewSet)

urlpatterns = [
    # 👇 TODO EL ROUTER VA BAJO api/
    path('api/', include(router.urls)),

    # LOGIN JWT
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 👇 FIX IMPORTANTE: comprar fuera del router
    path('api/comprar/', comprar),
]
