import { Navigate } from "react-router-dom";
import { getUser } from "../auth"; // ajusta la ruta según tu estructura

function PrivateRoute({ children }) {
  const user = getUser();

  return user ? children : <Navigate to="/" />;
}

export default PrivateRoute;