import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <main className="state">Loading your account...</main>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
