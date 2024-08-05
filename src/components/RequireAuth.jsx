import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth?.user) {
    // User is not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(auth.role)) {
    // User is authenticated but does not have the required role
    localStorage.removeItem("accessToken");
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // User is authenticated and has the required role
  return <Outlet />;
};

export default RequireAuth;


