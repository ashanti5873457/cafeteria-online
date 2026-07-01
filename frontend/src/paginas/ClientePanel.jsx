import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function ClientePanel() {
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [vista, setVista] = useState("productos");
  const [busqueda, setBusqueda] = useState("");

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

  const agregarAlCarrito = (prod) => {
    setCarrito([
      ...carrito,
      {
        id_producto: prod.id_producto,
        nombre: prod.nombre,
        precio: prod.precio,
      },
    ]);
  };

  const eliminarDelCarrito = (index) => {
    const nuevo = [...carrito];
    nuevo.splice(index, 1);
    setCarrito(nuevo);
  };

  const total = carrito.reduce(
    (suma, item) => suma + Number(item.precio),
    0
  );

  const pagar = async () => {
    try {
      await API.post("comprar/", {
        usuario: usuario.id_usuario,
        carrito,
        total,
      });

      alert("✅ Pedido realizado correctamente");

      setCarrito([]);
      cargarProductos();
    } catch (error) {
      console.log(error);
      alert("Error al procesar pedido");
    }
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container-fluid p-4 fondo-panel">

      {/* HEADER */}
      <div
        className="amazon-header shadow d-flex justify-content-between align-items-center flex-wrap p-3"
        style={{ background: "#111", color: "white" }}
      >

        {/* IZQUIERDA */}
        <div>
          <h2>☕ Cafetería Online</h2>
          <p className="mb-0">
            Bienvenido {usuario?.nombre}
          </p>
        </div>

        {/* DERECHA */}
        <div className="d-flex gap-2 flex-wrap align-items-center">

          <div
            className="carrito-badge"
            style={{
              background: "orange",
              padding: "5px 10px",
              borderRadius: "10px",
              fontWeight: "bold",
              color: "black"
            }}
          >
            🛒 {carrito.length}
          </div>

          {/* 🔥 BOTÓN NUEVO */}
          <button
            className="btn btn-info"
            onClick={() => setVista("datos")}
          >
            👤 Mis Datos
          </button>

          <button
            className="btn btn-success"
            onClick={() => setVista("productos")}
          >
            ☕ Productos
          </button>

          <button
            className="btn btn-danger"
            onClick={() => {
              localStorage.removeItem("usuario");
              navigate("/");
            }}
          >
            Salir
          </button>

        </div>
      </div>

      {/* 👤 VISTA MIS DATOS */}
      {vista === "datos" && (
        <div className="card shadow mt-4 p-3">

          <h3 className="text-primary mb-3">
            👤 Mis Datos
          </h3>

          <p><b>ID:</b> {usuario?.id_usuario}</p>
          <p><b>Nombre:</b> {usuario?.nombre}</p>
          <p><b>Email:</b> {usuario?.email}</p>
          <p><b>Rol:</b> {usuario?.rol}</p>

        </div>
      )}

      {/* PRODUCTOS */}
      {vista === "productos" && (
        <div className="row mt-4">

          {/* IZQUIERDA */}
          <div className="col-lg-9">

            <input
              type="text"
              className="form-control mb-3"
              placeholder="🔍 Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <div className="row">

              {productosFiltrados.map((prod) => {
                const agotado = Number(prod.stock) <= 0;

                return (
                  <div key={prod.id_producto} className="col-lg-4 col-md-6 mb-4 d-flex">

  <div className="card shadow producto-card-cliente w-100">

    <div className="card-body d-flex flex-column">

      <h5 className="titulo-card">
        {prod.nombre}
      </h5>

      <p className="descripcion-card">
        {prod.descripcion}
      </p>

      <h4 className="text-success precio-card">
        ${Number(prod.precio).toFixed(2)}
      </h4>

      <p className="stock-card">
        Stock:
        <span className={agotado ? "text-danger" : "text-success"}>
          {agotado ? " AGOTADO" : ` ${prod.stock}`}
        </span>
      </p>

      <button
        className="btn btn-warning w-100 mt-auto"
        disabled={agotado}
        onClick={() => agregarAlCarrito(prod)}
      >
        🛒 Agregar
      </button>

    </div>

  </div>

</div>
                );
              })}

            </div>
          </div>

          {/* CARRITO */}
          <div className="col-lg-3">

            <div className="card shadow p-3">

              <h5>🛒 Carrito ({carrito.length})</h5>

              {carrito.length === 0 ? (
                <p>No hay productos</p>
              ) : (
                <>
                  {carrito.map((item, i) => (
                    <div
                      key={i}
                      className="d-flex justify-content-between border-bottom py-2"
                    >
                      <div>
                        <b>{item.nombre}</b>
                        <br />
                        ${item.precio}
                      </div>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => eliminarDelCarrito(i)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <h4 className="mt-3 text-success">
                    Total: ${total.toFixed(2)}
                  </h4>

                  <button
                    className="btn btn-success w-100"
                    onClick={pagar}
                  >
                    ✅ Confirmar Pedido
                  </button>
                </>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default ClientePanel;