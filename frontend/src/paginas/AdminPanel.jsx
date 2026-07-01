import { Link } from "react-router-dom";
import NavbarAdmin from "../componentes/NavbarAdmin";

function AdminPanel() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  return (
    <>
      <NavbarAdmin />

      <div className="container mt-4">
        <h1 className="fw-bold mb-4">Panel Administrador</h1>
        <hr />
        <h3 className="mb-5">
          Bienvenido {usuario?.nombre || "Administrador"}
        </h3>

        <div className="row g-4">

          {/* PRODUCTOS */}
          <div className="col-md-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h3 className="fw-bold">Productos</h3>
                <p className="text-muted">Gestionar productos</p>
              </div>
            </div>
          </div>

          {/* CATEGORIAS */}
          <div className="col-md-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h3 className="fw-bold">Categorías</h3>
                <p className="text-muted">Gestionar categorías</p>
              </div>
            </div>
          </div>

          {/* USUARIOS */}
          <div className="col-md-3">
            <Link
              to="/usuarios"
              className="card shadow-sm h-100 text-start p-0"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="card-body">
                <h3 className="fw-bold">Usuarios</h3>
                <p className="text-muted">Ver clientes registrados</p>
              </div>
            </Link>
          </div>

          {/* PEDIDOS (CON BOTÓN DENTRO) */}
          <div className="col-md-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">

                <h3 className="fw-bold">Pedidos</h3>
                <p className="text-muted">Gestionar pedidos</p>

                <Link
                  to="/pedidos"
                  className="btn btn-primary mt-2"
                >
                  Ver Pedidos
                </Link>

              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default AdminPanel;