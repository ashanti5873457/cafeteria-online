import { useEffect, useState } from "react";
import API from "../api/api";
import "./productos.css";

function ProductosNuevo() {

  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [buscar, setBuscar] = useState("");

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const esAdmin = usuario?.rol === "admin";

  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  const [categorias, setCategorias] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    stock: "",
    imagen: "",
    descripcion: "",
    categoria: 0
  });

  // ======================
  // HELPERS
  // ======================
  const getId = (p) => p?.id ?? p?.id_producto;

  const fixImg = (url) =>
    url || "https://via.placeholder.com/300x200?text=Sin+Imagen";

  // ======================
  // LOAD DATA
  // ======================
  const cargarProductos = async () => {
    try {
      const res = await API.get("productos/");
      setProductos(res.data || []);
    } catch (error) {
      console.log(error.message);
    }
  };

  const cargarCategorias = async () => {
    try {
      const res = await API.get("categorias/");
      setCategorias(res.data || []);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  // ======================
  // CRUD
  // ======================
  const abrirAgregar = () => {
    setModoEdicion(false);
    setProductoEditando(null);

    setForm({
      nombre: "",
      precio: "",
      stock: "",
      imagen: "",
      descripcion: "",
      categoria: 0
    });

    setMostrarModal(true);
  };

  const abrirEditar = (p) => {
    setModoEdicion(true);
    setProductoEditando(p);

    setForm({
      nombre: p.nombre || "",
      precio: p.precio || "",
      stock: p.stock || "",
      imagen: p.imagen || "",
      descripcion: p.descripcion || "",
      categoria: p.categoria?.id_categoria || 0
    });

    setMostrarModal(true);
  };

  const guardar = async () => {
  try {
    if (!form.categoria) {
      alert("Selecciona una categoría");
      return;
    }

    const payload = {
      nombre: form.nombre,
      precio: Number(form.precio),
      stock: Number(form.stock),
      imagen: form.imagen.trim(),
      descripcion: form.descripcion,

      // ✅ FIX REAL PARA DJANGO
      categoria: Number(form.categoria)
    };

    console.log("PAYLOAD ENVIADO:", payload);

    if (modoEdicion) {
      const id = getId(productoEditando);
      await API.put(`productos/${id}/`, payload);
    } else {
      await API.post("productos/", payload);
    }

    await cargarProductos();
    setMostrarModal(false);

  } catch (error) {
    console.log("ERROR BACKEND:", error.response?.data || error.message);
  }
};







const eliminar = async (p) => {
  const id = getId(p);

  if (!id) {
    console.log("ID inválido:", p);
    return;
  }

  const confirmar = window.confirm(`¿Eliminar "${p.nombre}"?`);
  if (!confirmar) return;

  try {
    await API.delete(`productos/${id}/`);
    await cargarProductos();
  } catch (error) {
    console.log("Error eliminando:", error.response?.data || error.message);
  }
};




  // ======================
  // CARRITO
  // ======================
  const agregarCarrito = (p) => {
    const id = getId(p);

    setCarrito((prev) => {
      const existe = prev.find(item => getId(item) === id);

      if (existe) {
        return prev.map(item =>
          getId(item) === id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...prev, { ...p, cantidad: 1 }];
    });

    alert("Producto agregado 🛒");
  };

  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(buscar.toLowerCase())
  );

  // ======================
  // UI
  // ======================
  return (
  <div className="container mt-4">

    {/* HEADER */}
    <div className="d-flex justify-content-between align-items-center mb-4">

      <div>
        <h2 className="titulo-productos">
          📦 Gestión de Productos
        </h2>

        <input
          className="form-control mt-3"
          placeholder="🔍 Buscar producto..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          style={{ width: "300px" }}
        />
      </div>

      <div className="d-flex gap-2">

        <button
          className="btn-back"
          onClick={() => window.history.back()}
        >
          ⬅ Regresar
        </button>

        {esAdmin && (
          <button
            className="btn-add"
            onClick={abrirAgregar}
          >
            ➕ Nuevo Producto
          </button>
        )}

      </div>

    </div>

    {/* LISTA DE PRODUCTOS */}
    <div className="row">

      {filtrados.map((p) => {
        const id = getId(p);
        const agotado = Number(p.stock) <= 0;

        return (
          <div className="col-lg-4 col-md-6 mb-4 d-flex" key={id}>

            <div className="card product-card shadow w-100">

              <img
                src={fixImg(p.imagen)}
                alt={p.nombre}
                className="product-img"
              />

              <div className="card-body text-center">

                <h5 className="fw-bold">
                  {p.nombre}
                </h5>

                <h4 className="text-success fw-bold">
                  ${Number(p.precio).toFixed(2)}
                </h4>

                <p className="text-muted">
                  {p.descripcion}
                </p>

                <p className="fw-bold">
                  {agotado
                    ? "❌ AGOTADO"
                    : `📦 Stock: ${p.stock}`}
                </p>

                {esAdmin ? (
                  <>
                    <button
                      className="btn-modern btn-warning-modern me-2"
                      onClick={() => abrirEditar(p)}
                    >
                      ✏ Editar
                    </button>

                    <button
                      className="btn-modern btn-danger-modern"
                      onClick={() => eliminar(p)}
                    >
                      🗑 Eliminar
                    </button>
                  </>
                ) : (
                  <button
                    className="btn-add"
                    disabled={agotado}
                    onClick={() => agregarCarrito(p)}
                  >
                    🛒 Agregar al carrito
                  </button>
                )}

              </div>

            </div>

          </div>
        );
      })}

    </div>

    {/* MODAL */}
    {mostrarModal && (
      <div
        className="modal d-block"
        style={{ background: "#00000088" }}
      >
        <div className="modal-dialog">

          <div className="modal-content p-3">

            <h4>
              {modoEdicion ? "Editar Producto" : "Nuevo Producto"}
            </h4>

            <input
              className="form-control mb-2"
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) =>
                setForm({ ...form, nombre: e.target.value })
              }
            />

            <input
              className="form-control mb-2"
              type="number"
              placeholder="Precio"
              value={form.precio}
              onChange={(e) =>
                setForm({ ...form, precio: e.target.value })
              }
            />

            <input
              className="form-control mb-2"
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: e.target.value })
              }
            />

            <input
              className="form-control mb-2"
              placeholder="Imagen"
              value={form.imagen}
              onChange={(e) =>
                setForm({ ...form, imagen: e.target.value })
              }
            />

            <textarea
              className="form-control mb-2"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
            />

            <select
              className="form-control mb-3"
              value={form.categoria}
              onChange={(e) =>
                setForm({
                  ...form,
                  categoria: Number(e.target.value),
                })
              }
            >
              <option value={0}>
                Seleccione categoría
              </option>

              {categorias.map((c) => (
                <option
                  key={c.id_categoria}
                  value={c.id_categoria}
                >
                  {c.nombre}
                </option>
              ))}
            </select>

            <div className="d-flex justify-content-end">

              <button
                className="btn-modal btn-cancel"
                onClick={() => setMostrarModal(false)}
              >
                Cancelar
              </button>

              <button
                className="btn-modal btn-save ms-2"
                onClick={guardar}
              >
                Guardar
              </button>

            </div>

          </div>

        </div>
      </div>
    )}

    </div>
);
}

export default ProductosNuevo;