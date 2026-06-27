import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";

function ProtectedRoute({ children, permiso }) {
  const { estaAutenticado, tienePermiso } = useContext(AdminContext);

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  if (permiso && !tienePermiso(permiso)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
