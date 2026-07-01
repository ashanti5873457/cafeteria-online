import { useEffect, useState } from "react";
import API from "../api/api";
import NavbarAdmin from "../componentes/NavbarAdmin";
import "./categorias.css";

function Categorias() {
    const [categorias, setCategorias] = useState([]);

    const cargarCategorias = async () => {
        try {
            const res = await API.get("categorias/");
            setCategorias(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.log("Error al cargar categorías:", error);
            setCategorias([]);
        }
    };

    useEffect(() => {
        cargarCategorias();
    }, []);

    return (
        <div>
            <NavbarAdmin />

            <div className="container mt-4">

                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>
                        <h2 className="titulo-categorias">
                            📂 Gestión de Categorías
                        </h2>

                        <p className="text-muted mb-0">
                            Administra las categorías registradas
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
                            onClick={cargarCategorias}
                        >
                            🔄 Recargar
                        </button>

                    </div>

                </div>

                <div className="row">

                    {/* TABLA */}
                    <div className="col-lg-9">

                        <div className="categoria-card">

                            <div className="card-header-custom">
                                📋 Lista de Categorías
                            </div>

                            <div className="table-responsive">

                                <table className="table table-hover align-middle mb-0">

                                    <thead className="table-dark">
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Productos</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {categorias.length > 0 ? (

                                            categorias.map((categoria) => (

                                                <tr key={categoria.id_categoria}>

                                                    <td>
                                                        #{categoria.id_categoria}
                                                    </td>

                                                    <td className="fw-bold">
                                                        {categoria.nombre}
                                                    </td>

                                                    <td>
                                                        {categoria.productos &&
                                                        categoria.productos.length > 0 ? (

                                                            categoria.productos.map((p) => (
                                                                <span
                                                                    key={p.id_producto}
                                                                    className="badge bg-info me-1 mb-1"
                                                                >
                                                                    {p.nombre}
                                                                </span>
                                                            ))

                                                        ) : (

                                                            <span className="text-muted">
                                                                Sin productos
                                                            </span>

                                                        )}
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={`badge ${
                                                                categoria.activo === 1
                                                                    ? "bg-success"
                                                                    : "bg-danger"
                                                            }`}
                                                        >
                                                            {categoria.activo === 1
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
                                                    No hay categorías registradas
                                                </td>
                                            </tr>

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </div>

                    {/* PANEL LATERAL */}
                    <div className="col-lg-3">

                        <div className="categoria-card">

                            <h5 className="fw-bold mb-3">
                                📊 Resumen
                            </h5>

                            <div className="alert alert-primary">
                                Total categorías:
                                <strong> {categorias.length}</strong>
                            </div>

                            <div className="alert alert-success">
                                Activas:
                                <strong>
                                    {" "}
                                    {categorias.filter(
                                        c => c.activo === 1
                                    ).length}
                                </strong>
                            </div>

                            <div className="alert alert-danger">
                                Inactivas:
                                <strong>
                                    {" "}
                                    {categorias.filter(
                                        c => c.activo !== 1
                                    ).length}
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default Categorias;