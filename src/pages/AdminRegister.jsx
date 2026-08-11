import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerAdmin } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminRegister() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', storeName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await registerAdmin(form);
      loginAdmin(res.data);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>🏪 Create Store</h2>
        <p className="subtitle">Register as a store owner admin</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Your Full Name</label>
            <input id="admin-name" name="name" type="text" className="form-control" placeholder="Alice Tech" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Store Name</label>
            <input id="store-name" name="storeName" type="text" className="form-control" placeholder="TechWorld Store" value={form.storeName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input id="admin-email" name="email" type="email" className="form-control" placeholder="alice@store.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input id="admin-password" name="password" type="password" className="form-control" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
          </div>
          <button id="admin-register-btn" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Creating store...' : 'Create Store'}
          </button>
        </form>

        <div style={{textAlign:'center', marginTop:'1.5rem', color:'var(--text-muted)', fontSize:'0.875rem'}}>
          Already registered? <Link to="/admin/login" style={{color:'var(--primary-light)'}}>Login</Link>
        </div>
      </div>
    </div>
  );
}
