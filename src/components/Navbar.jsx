import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, admin, logoutUser, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  const handleUserLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          Multi<span>Store</span>
        </Link>

        <div className="navbar-links">
          {!isAdminPage && (
            <>
              <Link to="/" className={isActive('/')}>Home</Link>
              <Link to="/stores" className={isActive('/stores')}>Stores</Link>
              {user ? (
                <>
                  <Link to="/cart" className={isActive('/cart')}>🛒 Cart</Link>
                  <Link to="/my-orders" className={isActive('/my-orders')}>Orders</Link>
                  <Link to="/profile" className={isActive('/profile')}>👤 {user.name.split(' ')[0]}</Link>
                  <button className="btn btn-ghost btn-sm" style={{marginLeft:'0.5rem'}} onClick={handleUserLogout}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className={isActive('/login')}>Login</Link>
                  <Link to="/register">
                    <button className="btn btn-primary btn-sm">Register</button>
                  </Link>
                </>
              )}
            </>
          )}

          {isAdminPage && (
            <>
              {admin ? (
                <>
                  <span className="nav-link" style={{color:'var(--primary-light)', fontWeight:600}}>🏪 {admin.storeName}</span>
                  <Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>Dashboard</Link>
                  <Link to="/admin/products" className={isActive('/admin/products')}>Products</Link>
                  <Link to="/admin/categories" className={isActive('/admin/categories')}>Categories</Link>
                  <Link to="/admin/orders" className={isActive('/admin/orders')}>Orders</Link>
                  <button className="btn btn-ghost btn-sm" style={{marginLeft:'0.5rem'}} onClick={handleAdminLogout}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/" className="nav-link">← Customer Site</Link>
                  <Link to="/admin/login" className={isActive('/admin/login')}>Admin Login</Link>
                  <Link to="/admin/register">
                    <button className="btn btn-primary btn-sm">Register Store</button>
                  </Link>
                </>
              )}
            </>
          )}

          {!isAdminPage && (
            <Link to="/admin/login" className="nav-link" style={{marginLeft:'0.5rem', color:'var(--text-faint)', fontSize:'0.75rem'}}>
              Admin →
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
