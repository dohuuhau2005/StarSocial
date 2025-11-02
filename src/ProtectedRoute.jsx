import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/Login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload.role;

    if (!allowedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (e) {
    console.error("Invalid token:", e);
    return <Navigate to="/Login" replace />;
  }
};

export default ProtectedRoute;
