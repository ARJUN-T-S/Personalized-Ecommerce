import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/api';

const STATUS_CLASS = {
  Pending: 'badge-warning',
  Confirmed: 'badge-info',
  Shipped: 'badge-primary',
  Delivered: 'badge-success',
  Cancelled: 'badge-danger',
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap" style={{marginTop:'5rem'}}><div className="spinner"></div></div>;

  return (
    <div className="page">
      <div className="container">
        <h1 style={{fontSize:'1.75rem', fontWeight:700, marginBottom:'2rem'}}>📦 My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Browse stores and place your first order.</p>
            <Link to="/stores" className="btn btn-primary">Browse Stores</Link>
          </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
            {orders.map(order => (
              <Link key={order._id} to={`/order/${order._id}`} style={{textDecoration:'none'}}>
                <div className="card" style={{cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem'}}>
                  <div>
                    <div style={{fontWeight:600, marginBottom:'0.25rem'}}>Order #{order._id.slice(-8).toUpperCase()}</div>
                    <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>
                      🏪 {order.adminId?.storeName} · {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </div>
                    <div style={{fontSize:'0.8rem', color:'var(--text-faint)', marginTop:'0.25rem'}}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', {year:'numeric', month:'short', day:'numeric'})}
                    </div>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
                    <span style={{fontWeight:700, fontSize:'1rem', color:'var(--primary-light)'}}>
                      ${order.totalAmount.toFixed(2)}
                    </span>
                    <span className={`badge ${STATUS_CLASS[order.status] || 'badge-muted'}`}>{order.status}</span>
                    <span style={{color:'var(--text-faint)', fontSize:'0.8rem'}}>View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
