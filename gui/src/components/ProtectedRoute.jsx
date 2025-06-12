import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
  const { token } = useAuth();

  // If there is no token, redirect the user to the /login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If there is a token, render the child route component
  // The <Outlet /> is a placeholder for the actual page component (e.g., BookListPage)
  return <Outlet />;
}

export default ProtectedRoute;
