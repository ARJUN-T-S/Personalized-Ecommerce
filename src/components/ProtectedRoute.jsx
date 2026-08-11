import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectUser({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function ProtectAdmin({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}
