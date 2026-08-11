import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginAdmin as loginAdminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await loginAdminAPI(form);
      loginAdmin(res.data);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>🏪 Admin Login</h2>
        <p className="subtitle">Login to manage your store</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input id="admin-email" name="email" type="email" className="form-control" placeholder="alice@techworld.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input id="admin-password" name="password" type="password" className="form-control" placeholder="••••••••" value={form.password} onChange={handleChange} required />
          </div>
          <button id="admin-login-btn" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>

        <div style={{textAlign:'center', marginTop:'1.5rem', color:'var(--text-muted)', fontSize:'0.875rem'}}>
          New store owner? <Link to="/admin/register" style={{color:'var(--primary-light)'}}>Register your store</Link>
        </div>
        <div style={{textAlign:'center', marginTop:'0.5rem'}}>
          <Link to="/" style={{color:'var(--text-faint)', fontSize:'0.8rem'}}>← Back to Customer Site</Link>
        </div>

        {/* Test credentials hint */}
        <div style={{marginTop:'1.5rem', padding:'0.75rem', background:'var(--bg-elevated)', borderRadius:'var(--radius-sm)', fontSize:'0.75rem', color:'var(--text-muted)'}}>
          <strong style={{color:'var(--text)'}}>Test Credentials:</strong><br/>
          alice@techworld.com / password123<br/>
          bob@fashionhub.com / password123
        </div>
      </div>
    </div>
  );
}
