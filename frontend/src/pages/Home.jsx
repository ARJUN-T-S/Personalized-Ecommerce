import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllAdmins } from '../services/api';

export default function Home() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllAdmins()
      .then(r => {
        if (Array.isArray(r.data)) {
          setStores(r.data.slice(0, 6));
        } else {
          setStores([]);
        }
      })
      .catch(() => setStores([]))
      .finally(() => setLoading(false));
  }, []);

  const icons = ['🖥️', '👗', '🏠', '🍕', '📚', '💊'];

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-content">
          <h1>Shop from <span>Multiple Stores</span><br />All in One Place</h1>
          <p>Discover products from various independent stores. Add to cart, track orders, and leave reviews — all in one platform.</p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/stores')}>Browse Stores</button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/register')}>Create Account</button>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section style={{background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '1.5rem 0'}}>
        <div className="container">
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', textAlign:'center'}}>
            <div>
              <div style={{fontSize:'1.75rem', fontWeight:800, color:'var(--primary-light)'}}>{stores.length}+</div>
              <div style={{fontSize:'0.8rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em'}}>Active Stores</div>
            </div>
            <div>
              <div style={{fontSize:'1.75rem', fontWeight:800, color:'var(--accent)'}}>100%</div>
              <div style={{fontSize:'0.8rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em'}}>Secure Checkout</div>
            </div>
            <div>
              <div style={{fontSize:'1.75rem', fontWeight:800, color:'var(--success)'}}>⭐ 5.0</div>
              <div style={{fontSize:'0.8rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em'}}>Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stores Section */}
      <section className="page">
        <div className="container">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="section-title" style={{marginBottom:'0.25rem'}}>Featured Stores</h2>
              <p style={{color:'var(--text-muted)', fontSize:'0.9rem'}}>Click a store to browse its products</p>
            </div>
            <Link to="/stores" className="btn btn-ghost">View All →</Link>
          </div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner"></div></div>
          ) : stores.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏪</div>
              <h3>No stores yet</h3>
              <p>Check back later or seed the database.</p>
            </div>
          ) : (
            <div className="grid-3">
              {stores.map((store, i) => (
                <div key={store._id} className="store-card" onClick={() => navigate(`/store/${store._id}`)}>
                  <div className="store-icon">{icons[i % icons.length]}</div>
                  <div className="store-name">{store.storeName}</div>
                  <div className="store-owner">by {store.name}</div>
                  <div style={{marginTop:'1rem'}}>
                    <span className="badge badge-primary">View Products →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section style={{background:'var(--bg-card)', borderTop:'1px solid var(--border)', padding:'4rem 0'}}>
        <div className="container">
          <h2 style={{textAlign:'center', fontSize:'1.75rem', fontWeight:700, marginBottom:'0.5rem'}}>How It Works</h2>
          <p style={{textAlign:'center', color:'var(--text-muted)', marginBottom:'3rem'}}>Shopping made simple in 4 steps</p>
          <div className="grid-4">
            {[
              {step:'1', icon:'🔐', title:'Create Account', desc:'Sign up as a customer in seconds'},
              {step:'2', icon:'🏪', title:'Browse Stores', desc:'Explore products from multiple stores'},
              {step:'3', icon:'🛒', title:'Add to Cart', desc:'Add items to your cart per store'},
              {step:'4', icon:'📦', title:'Place Order', desc:'Checkout and track your order status'},
            ].map(item => (
              <div key={item.step} className="card" style={{textAlign:'center'}}>
                <div style={{fontSize:'2.5rem', marginBottom:'0.75rem'}}>{item.icon}</div>
                <div style={{fontSize:'0.7rem', fontWeight:700, color:'var(--primary-light)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.5rem'}}>Step {item.step}</div>
                <div style={{fontWeight:700, marginBottom:'0.5rem'}}>{item.title}</div>
                <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
