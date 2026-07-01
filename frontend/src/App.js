import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./paginas/Login";
import LoginForm from "./paginas/LoginForm";

import AdminPanel from "./paginas/AdminPanel";
import Cliente from "./paginas/Cliente";

import Usuarios from "./paginas/Usuarios";
import Categorias from "./paginas/Categorias";
import ProductosNuevo from "./paginas/ProductosNuevo";
import MisDatos from "./paginas/MisDatos";
import PedidosAdmin from "./paginas/PedidosAdmin";
import Admin from "./paginas/Admin";

import RutaProtegida from "./componentes/RutaProtegida";
import PrivateRoute from "./componentes/PrivateRoute";

import "react-toastify/dist/ReactToastify.css";
import "./styles/auth";

function App() {
  return (
    <Router>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-form" element={<LoginForm />} />

        {/* ADMIN PANEL */}
        <Route
          path="/admin"
          element={
            <RutaProtegida rolPermitido="admin">
              <AdminPanel />
            </RutaProtegida>
          }
        />

        {/* USUARIOS */}
        <Route
          path="/usuarios"
          element={
            <RutaProtegida rolPermitido="admin">
              <Usuarios />
            </RutaProtegida>
          }
        />

        {/* PRODUCTOS */}
        <Route
          path="/productos"
          element={
            <RutaProtegida rolPermitido="admin">
              <ProductosNuevo />
            </RutaProtegida>
          }
        />

        {/* CATEGORIAS */}
        <Route
          path="/categorias"
          element={
            <RutaProtegida rolPermitido="admin">
              <Categorias />
            </RutaProtegida>
          }
        />

        {/* PEDIDOS */}
        <Route
          path="/pedidos"
          element={
            <RutaProtegida rolPermitido="admin">
              <PedidosAdmin />
            </RutaProtegida>
          }
        />

        {/* CLIENTE */}
        <Route
          path="/cliente"
          element={
            <RutaProtegida rolPermitido="cliente">
              <Cliente />
            </RutaProtegida>
          }
        />

        <Route
          path="/menucliente"
          element={
            <RutaProtegida rolPermitido="cliente">
              <Cliente />
            </RutaProtegida>
          }
        />

        {/* MIS DATOS */}
        <Route
          path="/misdatos"
          element={
            <RutaProtegida rolPermitido="cliente">
              <MisDatos />
            </RutaProtegida>
          }
        />

        {/* ADMIN EXTRA */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;