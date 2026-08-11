import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAdmins } from '../services/api';

const ICONS = ['🖥️', '👗', '🏠', '🍕', '📚', '💊', '🎮', '🎨', '🌿', '🚲'];

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAllAdmins()
      .then(r => setStores(r.data))
      .catch(() => setError('Failed to load stores.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header-inner" style={{marginBottom:'2rem'}}>
          <div>
            <h1 className="section-title" style={{marginBottom:'0.25rem'}}>All Stores</h1>
            <p style={{color:'var(--text-muted)'}}>Browse and shop from any store</p>
          </div>
          <div className="badge badge-primary" style={{fontSize:'0.9rem', padding:'0.4rem 1rem'}}>
            {stores.length} Stores
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="spinner-wrap"><div className="spinner"></div></div>
        ) : stores.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏪</div>
            <h3>No stores available</h3>
            <p>Run the seed script to populate sample stores.</p>
          </div>
        ) : (
          <div className="grid-3">
            {stores.map((store, i) => (
              <div key={store._id} className="store-card" onClick={() => navigate(`/store/${store._id}`)}>
                <div className="store-icon">{ICONS[i % ICONS.length]}</div>
                <div className="store-name">{store.storeName}</div>
                <div className="store-owner">Managed by {store.name}</div>
                <div style={{marginTop:'1.25rem'}}>
                  <button className="btn btn-primary btn-full">Browse Products →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
