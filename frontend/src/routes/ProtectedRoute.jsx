import { Navigate, Outlet } from "react-router-dom";
import { isTokenValid, removeToken } from "../utils/auth";

const ProtectedRoute = () => {
  const valid = isTokenValid();

  if (!valid) {
    removeToken();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
