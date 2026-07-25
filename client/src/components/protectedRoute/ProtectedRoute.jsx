import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppState } from "../../App";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AppState);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/register" />;
  }

  return children;
};

export default ProtectedRoute;
