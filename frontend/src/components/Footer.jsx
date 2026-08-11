import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', padding: '2.5rem 0 1.5rem', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.25rem' }}>
              Multi<span style={{ color: 'var(--primary)' }}>Store</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              MERN Stack Multi-Store E-Commerce Platform
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Link to="/" style={{ color: 'inherit' }}>Home</Link>
            <Link to="/stores" style={{ color: 'inherit' }}>Stores</Link>
            <Link to="/login" style={{ color: 'inherit' }}>Login</Link>
            <Link to="/admin/login" style={{ color: 'var(--primary-light)' }}>Admin Portal</Link>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', marginTop: '1.5rem', paddingTop: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-faint)' }}>
          © {new Date().getFullYear()} MultiStore E-Commerce. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
