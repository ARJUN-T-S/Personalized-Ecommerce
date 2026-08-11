import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser as loginUserAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await loginUserAPI(form);
      loginUser(res.data);
      navigate('/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to your customer account</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input id="email" name="email" type="email" className="form-control" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input id="password" name="password" type="password" className="form-control" placeholder="••••••••" value={form.password} onChange={handleChange} required />
          </div>
          <button id="login-btn" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{textAlign:'center', marginTop:'1.5rem', color:'var(--text-muted)', fontSize:'0.875rem'}}>
          Don't have an account? <Link to="/register" style={{color:'var(--primary-light)'}}>Register</Link>
        </div>
        <div style={{textAlign:'center', marginTop:'0.5rem', color:'var(--text-faint)', fontSize:'0.8rem'}}>
          Are you a store owner? <Link to="/admin/login" style={{color:'var(--text-muted)'}}>Admin Login →</Link>
        </div>
      </div>
    </div>
  );
}
