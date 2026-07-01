from rest_framework import viewsets
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response

import json

from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

from .models import (
    Usuario,
    Producto,
    Pedido,
    DetallePedido,
    Categoria
)

from .serializers import (
    UsuarioSerializer,
    CategoriaSerializer,
    ProductoSerializer,
    LoginSerializer,
    PedidoSerializer
)

# =========================
# PEDIDOS VIEWSET
# =========================
class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer


# =========================
# LOGIN (JWT / TOKEN)
# =========================
@api_view(['POST'])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(username=email, password=password)

    if user is None:
        return Response({"error": "Credenciales incorrectas"}, status=400)

    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        "token": token.key,
        "username": user.username,
        "email": user.email
    })


@api_view(['POST'])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = serializer.validated_data["user"]
    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        "token": token.key,
        "username": user.username,
        "email": user.email
    })


# =========================
# LOGIN SIMPLE (tabla Usuario)
# =========================
@csrf_exempt
def login_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        data = json.loads(request.body)

        email = data.get("email", "").strip()
        password = data.get("password", "").strip()

        user = Usuario.objects.filter(
            email=email,
            password=password,
            activo=True
        ).first()

        if not user:
            return JsonResponse({"error": "Credenciales inválidas"}, status=400)

        return JsonResponse({
            "id_usuario": user.id_usuario,
            "nombre": user.nombre,
            "email": user.email,
            "rol": user.rol
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# =========================
# PRODUCTOS
# =========================
def productos(request):
    data = list(Producto.objects.values(
        "id",
        "nombre",
        "precio",
        "stock",
        "imagen",
        "descripcion",
        "categoria_id"
    ))
    return JsonResponse(data, safe=False)


# =========================
# COMPRA (CORREGIDO)
# =========================
@api_view(["POST"])
def comprar(request):
    try:
        usuario_id = request.data.get("usuario_id")
        carrito = request.data.get("carrito")

        if not usuario_id:
            return Response({"error": "Falta usuario_id"}, status=400)

        usuario = Usuario.objects.get(id_usuario=usuario_id)

        if not carrito:
            return Response({"error": "Carrito vacío"}, status=400)

        total = 0

        pedido = Pedido.objects.create(usuario=usuario, total=0)

        for item in carrito:
            producto = Producto.objects.get(id=item["id"])
            cantidad = item.get("cantidad", 1)

            # 🔥 DESCONTAR STOCK
            if producto.stock < cantidad:
                return Response(
                    {"error": f"No hay suficiente stock de {producto.nombre}"},
                    status=400
                )

            producto.stock -= cantidad
            producto.save()

            # 🔥 DETALLE PEDIDO
            DetallePedido.objects.create(
                pedido=pedido,
                producto=producto,
                cantidad=cantidad,
                precio=producto.precio
            )

            total += float(producto.precio) * cantidad

        pedido.total = total
        pedido.save()

        return Response({
            "ok": True,
            "pedido_id": pedido.id_pedido
        })

    except Exception as e:
        return Response({"error": str(e)}, status=400)


# =========================
# VIEWSETS
# =========================
class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer