import { useEffect, useState } from "react";
import API from "../api/api";
import NavbarAdmin from "../componentes/NavbarAdmin";
import "./usuarios.css";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  const cargarUsuarios = async () => {
    try {
      const res = await API.get("usuarios/");
      setUsuarios(res.data);
    } catch (error) {
      console.log("Error al cargar usuarios:", error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <div>
      <NavbarAdmin />

      <div className="container mt-4">

        {/* HEADER MODERNO */}
        <div className="admin-header d-flex justify-content-between align-items-center">

          <div>
            <h2 className="titulo-productos">
              👤 Gestión de Usuarios
            </h2>

            <p className="text-muted mb-0">
              Administración de clientes registrados
            </p>
          </div>

          <div className="d-flex gap-2">

            <button
              className="btn-back"
              onClick={() => window.history.back()}
            >
              ⬅ Regresar
            </button>

            <button
              className="btn-add"
              onClick={cargarUsuarios}
            >
              🔄 Recargar
            </button>

          </div>

        </div>

        <div className="row mt-4">

          {/* TABLA */}
          <div className="col-lg-9">

            <div className="card product-card shadow border-0">

              <div className="card-header bg-dark text-white fw-bold">
                👥 Lista de Usuarios
              </div>

              <div className="table-responsive">

                <table className="table table-hover align-middle mb-0">

                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Estado</th>
                    </tr>
                  </thead>

                  <tbody>

                    {usuarios.length > 0 ? (
                      usuarios.map((u) => (
                        <tr key={u.id_usuario}>

                          <td>
                            <span className="fw-bold">
                              #{u.id_usuario}
                            </span>
                          </td>

                          <td className="fw-semibold">
                            👤 {u.nombre}
                          </td>

                          <td>
                            📧 {u.email}
                          </td>

                          <td>
                            <span
                              className={`badge ${
                                u.activo === 1
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              {u.activo === 1
                                ? "Activo"
                                : "Inactivo"}
                            </span>
                          </td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center p-4"
                        >
                          No hay usuarios registrados
                        </td>
                      </tr>
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

          {/* PANEL ESTADÍSTICAS */}
          <div className="col-lg-3">

            <div className="card product-card shadow border-0">

              <div className="card-header bg-primary text-white fw-bold">
                📊 Estadísticas
              </div>

              <div className="card-body">

                <div className="alert alert-info">
                  👥 Total usuarios:
                  <strong> {usuarios.length}</strong>
                </div>

                <div className="alert alert-success">
                  ✅ Activos:
                  <strong>
                    {" "}
                    {usuarios.filter(
                      (u) => u.activo === 1
                    ).length}
                  </strong>
                </div>

                <div className="alert alert-danger">
                  ❌ Inactivos:
                  <strong>
                    {" "}
                    {usuarios.filter(
                      (u) => u.activo !== 1
                    ).length}
                  </strong>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Usuarios;