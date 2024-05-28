import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  if (localStorage.getItem("isLoggedIn") !== "true") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
