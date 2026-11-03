import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function AdminRoute() {
  const { user, loading } = useAuth();
  if (loading) return <main className="state">Loading your account...</main>;
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
}
