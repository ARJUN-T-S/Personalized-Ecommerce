import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile, deleteUserProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, loginUser, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
  });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setMsg('');

    try {
      const updateData = { name: form.name, phone: form.phone };
      if (form.password) updateData.password = form.password;

      const res = await updateUserProfile(updateData);
      loginUser({ ...user, name: res.data.name, phone: res.data.phone });
      setMsg('Profile updated successfully!');
      setForm((f) => ({ ...f, password: '' }));
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your user account? This action cannot be undone.'))
      return;
    try {
      await deleteUserProfile();
      logoutUser();
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account.');
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '550px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem' }}>
          👤 Customer Profile
        </h1>

        {msg && <div className="alert alert-success">{msg}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                name="name"
                type="text"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                name="email"
                type="email"
                className="form-control"
                value={form.email}
                disabled
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>Email cannot be changed</span>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                name="phone"
                type="tel"
                className="form-control"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 234 567 890"
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password (leave blank to keep current)</label>
              <input
                name="password"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
              {submitting ? 'Updating...' : 'Save Profile Changes'}
            </button>
          </form>

          <div style={{ borderTop: '1px solid var(--border)', marginTop: '2rem', paddingTop: '1.5rem' }}>
            <h4 style={{ color: 'var(--danger-light)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              Danger Zone
            </h4>
            <button className="btn btn-danger btn-sm" onClick={handleDeleteAccount}>
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
