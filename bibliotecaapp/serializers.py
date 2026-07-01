from rest_framework import serializers
from django.contrib.auth import authenticate

from .models import Producto, Categoria, Usuario, Pedido, DetallePedido


# =========================
# PRODUCTO
# =========================
class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'


# =========================
# DETALLE PEDIDO (DEBE IR ANTES DE PEDIDO)
# =========================
class DetallePedidoSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source="producto.nombre", read_only=True)
    producto_precio = serializers.CharField(source="producto.precio", read_only=True)

    class Meta:
        model = DetallePedido
        fields = "__all__"


# =========================
# PEDIDO
# =========================
class PedidoSerializer(serializers.ModelSerializer):
    cliente = serializers.CharField(source="usuario.nombre", read_only=True)
    email = serializers.CharField(source="usuario.email", read_only=True)

    detalles = DetallePedidoSerializer(
        source="detallepedido_set",
        many=True,
        read_only=True
    )

    class Meta:
        model = Pedido
        fields = "__all__"


# =========================
# LOGIN
# =========================
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(
            username=data['email'],
            password=data['password']
        )

        if not user:
            raise serializers.ValidationError("Credenciales incorrectas")

        data["user"] = user
        return data


# =========================
# USUARIO
# =========================
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = "__all__"


# =========================
# CATEGORIA
# =========================
class CategoriaSerializer(serializers.ModelSerializer):
    productos = ProductoSerializer(many=True, read_only=True)

    class Meta:
        model = Categoria
        fields = "__all__"