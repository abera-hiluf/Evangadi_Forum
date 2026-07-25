import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppState } from "../../App";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AppState);

  if (loading) {
    return <div>Loading...</div>; // You can make this prettier
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
