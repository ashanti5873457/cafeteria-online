import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function LoginForm() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate();

const login = async (e) => {
e.preventDefault();

console.log("EMAIL ENVIADO:", email);
console.log("PASSWORD ENVIADO:", password);

try {
  const res = await API.post("login/", {
    username: email.split("@")[0],
    password: password
  });

  console.log("RESPUESTA BACKEND:", res.data);

  localStorage.setItem("token", res.data.token);

  let rol = "cliente";

  if (email.toLowerCase().includes("admin")) {
    rol = "admin";
  }

  const user = {
    id_usuario: res.data.id_usuario || res.data.id || null,
    username: res.data.username || email.split("@")[0],
    email: email,
    rol: rol
  };

  localStorage.setItem("usuario", JSON.stringify(user));

  console.log("USUARIO GUARDADO:", user);

  if (user.rol === "admin") {
    navigate("/admin");
  } else {
    navigate("/cliente");
  }

} catch (error) {
  console.log("ERROR LOGIN:", error);

  if (error.response) {
    console.log("STATUS:", error.response.status);
    console.log("ERROR BACKEND:", error.response.data);

    alert(
      error.response.data?.non_field_errors?.[0] ||
      error.response.data?.detail ||
      "Credenciales incorrectas"
    );
  } else {
    console.log("ERROR RED:", error.message);
    alert("No se pudo conectar con el servidor");
  }
}

};

return ( <div className="container d-flex justify-content-center mt-5">
<div className="card p-4 shadow" style={{ width: "400px" }}> <h3 className="text-center">Iniciar Sesión</h3>

    <form onSubmit={login}>
      <input
        className="form-control mb-2"
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        className="form-control mb-3"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button className="btn btn-success w-100" type="submit">
        Entrar
      </button>
    </form>
  </div>
</div>

);
}

export default LoginForm;
