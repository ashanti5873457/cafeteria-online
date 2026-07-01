import { useEffect, useState } from "react";
import API from "../api/api";

function MenuPublico() {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        API.get("productos/")
            .then(res => setProductos(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Menú Escolar</h2>

            <div className="row">
                {productos.length > 0 ? (
                    productos.map((p) => (
                        <div className="col-md-4" key={p.id_producto}>
                            <div className="card m-2 shadow-sm">
                                <div className="card-body">
                                    <h5>{p.nombre}</h5>
                                    <p>{p.descripcion}</p>
                                    <h4>${p.precio}</h4>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">
                        No hay productos disponibles.
                    </p>
                )}
            </div>
        </div>
    );
}

export default MenuPublico;