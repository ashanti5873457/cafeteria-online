import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./Cliente.css";

function Cliente() {
  const navigate = useNavigate();

  const usuario = {
    id_usuario: 2,
    nombre: "Sherlin",
    email: "sherlin@gmail.com",
    rol: "cliente"
  };

  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [vista, setVista] = useState("productos");

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await API.get("productos/");
      setProductos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // =========================
  // AGREGAR AL CARRITO (SIN ALERTA)
  // =========================
  const agregarAlCarrito = (prod) => {
    setCarrito((prev) => {
      const id = prod.id || prod.id_producto;

      const existe = prev.find((p) => p.id === id);

      if (existe) {
        return prev.map((p) =>
          p.id === id
            ? { ...p, cantidad: Math.min(p.cantidad + 1, p.stock) }
            : p
        );
      }

      return [
        ...prev,
        {
          id,
          nombre: prod.nombre,
          precio: Number(prod.precio),
          stock: Number(prod.stock),
          cantidad: 1
        }
      ];
    });
  };

  // =========================
  // CANTIDAD
  // =========================
  const cambiarCantidad = (id, delta) => {
    setCarrito((prev) =>
      prev
        .map((p) => {
          if (p.id !== id) return p;

          const nueva = p.cantidad + delta;

          if (nueva < 1) return p;
          if (nueva > p.stock) return p;

          return { ...p, cantidad: nueva };
        })
        .filter((p) => p.cantidad > 0)
    );
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  const total = carrito.reduce(
    (sum, p) => sum + p.precio * p.cantidad,
    0
  );

  // =========================
  // PAGAR (FUNCIONA)
  // =========================
  const pagar = async () => {
    try {
      if (carrito.length === 0) return;

      const confirmar = window.confirm("¿Confirmar pedido?");
      if (!confirmar) return;

      await API.post("comprar/", {
        usuario_id: usuario.id_usuario,
        carrito: carrito.map((p) => ({
          id: p.id,
          cantidad: p.cantidad
        }))
      });

      setCarrito([]);
      cargarProductos();

      alert("✅ Pedido realizado correctamente");

    } catch (error) {
      console.log(error);
      alert("❌ Error al comprar");
    }
  };

  return (
    <div className="cliente-container">

      {/* HEADER */}
      <div className="header">
        <h2>☕ Cafetería Online</h2>

        <div className="header-right">
          <input
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <button onClick={() => setVista("datos")}>👤 Mis Datos</button>
          <button onClick={() => setVista("productos")}>🛒 Productos</button>
          <button onClick={() => navigate("/")}>Salir</button>
        </div>
      </div>

      {/* ================= PRODUCTOS ================= */}
      {vista === "productos" && (
        <div className="productos-grid">

          {productosFiltrados.map((p) => {
            const agotado = Number(p.stock) <= 0;

            return (
              <div className="producto-card-cliente" key={p.id || p.id_producto}>

                <img
                  className="producto-img"
                  src={p.imagen || "/placeholder.png"}
                  alt={p.nombre}
                />

                <div className="producto-contenido">

                  <div className="titulo-card">{p.nombre}</div>

                  <div className="descripcion-card">{p.descripcion}</div>

                  <div className="precio-card">
                    ${Number(p.precio).toFixed(2)}
                  </div>

                  <div className="stock-card">
                    {agotado ? (
                      <span className="stock-agotado">AGOTADO</span>
                    ) : (
                      <span className="stock-badge">
                        Stock: {p.stock}
                      </span>
                    )}
                  </div>

                  <button
                    className="btn-agregar"
                    disabled={agotado}
                    onClick={() => agregarAlCarrito(p)}
                  >
                    🛒 Agregar
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= CARRITO ================= */}
      {vista === "productos" && (
        <div className="carrito">

          <h3>🛒 Carrito</h3>

          {carrito.length === 0 && <p>Vacío</p>}

          {carrito.map((p) => (
            <div key={p.id} className="carrito-item">

              <span>{p.nombre}</span>

              <div>
                <button onClick={() => cambiarCantidad(p.id, -1)}>-</button>
                <span>{p.cantidad}</span>
                <button onClick={() => cambiarCantidad(p.id, 1)}>+</button>
              </div>

              <span>
                ${(p.precio * p.cantidad).toFixed(2)}
              </span>

              <button onClick={() => eliminarDelCarrito(p.id)}>
                ❌
              </button>

            </div>
          ))}

          <h3>Total: ${total.toFixed(2)}</h3>

          <button className="btn-pagar" onClick={pagar}>
            Confirmar pedido
          </button>

        </div>
      )}

      {/* ================= MODAL MIS DATOS ================= */}
      {vista === "datos" && (
        <div className="modal-overlay" onClick={() => setVista("productos")}>

          <div className="modal-card" onClick={(e) => e.stopPropagation()}>

            <div className="profile-header">
              <div className="avatar">
                {usuario?.nombre?.charAt(0)?.toUpperCase()}
              </div>

              <div>
                <h2 className="profile-name">{usuario?.nombre}</h2>
                <span className="profile-sub">👤 Perfil de usuario</span>
              </div>
            </div>

            <div className="role-badge">
              🟢 {usuario?.rol}
            </div>

            <div className="profile-info">

              <div className="info-row">
                <span>ID</span>
                <b>#{usuario?.id_usuario}</b>
              </div>

              <div className="info-row">
                <span>Nombre</span>
                <b>{usuario?.nombre}</b>
              </div>

              <div className="info-row">
                <span>Email</span>
                <b>{usuario?.email}</b>
              </div>

              <div className="info-row">
                <span>Estado</span>
                <b className="status-ok">Activo</b>
              </div>

            </div>

            <button
              className="btn-back"
              onClick={() => setVista("productos")}
            >
              ✖ Cerrar
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default Cliente;