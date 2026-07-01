import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function PedidosAdmin() {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const res = await API.get("pedidos/");
      setPedidos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      alert("Error al cargar pedidos");
    }
  };

  const formatearFechaMX = (fecha) => {
    if (!fecha) return "Sin fecha";

    const fechaObj = new Date(fecha.replace(" ", "T").split(".")[0]);

    if (isNaN(fechaObj.getTime())) return "Fecha inválida";

    return new Intl.DateTimeFormat("es-MX", {
      timeZone: "America/Mexico_City",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(fechaObj);
  };

  return (
    <div className="container mt-4">

      {/* 🔙 BOTÓN REGRESAR */}
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        ⬅ Regresar
      </button>

      <h2>📦 Pedidos Realizados</h2>

      <div className="table-responsive">
        <table className="table table-hover shadow">

          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Email</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Productos</th>
            </tr>
          </thead>

          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id_pedido || pedido.id}>

                <td>#{pedido.id_pedido || pedido.id}</td>
                <td>{pedido.cliente || "Sin nombre"}</td>
                <td>{pedido.email || "Sin email"}</td>
                <td>{formatearFechaMX(pedido.fecha)}</td>
                <td>${pedido.total}</td>

                <td>
                  {(pedido.detalles || []).length > 0 ? (
                    pedido.detalles.map((d, i) => (
                      <div key={i}>
                        🥐 {d.producto_nombre} (x{d.cantidad})
                      </div>
                    ))
                  ) : (
                    <span>Sin productos</span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}

export default PedidosAdmin;