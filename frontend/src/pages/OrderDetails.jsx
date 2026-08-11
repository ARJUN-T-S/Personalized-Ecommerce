import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getOrderById } from '../services/api';
import { handleImageError, PLACEHOLDER_IMAGE } from '../utils/imageUtils';

const STATUS_CLASS = {
  Pending: 'status-Pending',
  Confirmed: 'status-Confirmed',
  Shipped: 'status-Shipped',
  Delivered: 'status-Delivered',
  Cancelled: 'status-Cancelled',
};

export default function OrderDetails() {
  const { id } = useParams();
  const location = useLocation();
  const justPlaced = new URLSearchParams(location.search).get('placed') === 'true';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id)
      .then(r => setOrder(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner-wrap" style={{marginTop:'5rem'}}><div className="spinner"></div></div>;
  if (!order) return <div className="container page"><div className="alert alert-danger">Order not found.</div></div>;

  return (
    <div className="page">
      <div className="container" style={{maxWidth:'700px'}}>
        {justPlaced && (
          <div className="alert alert-success" style={{marginBottom:'1.5rem', fontSize:'1rem'}}>
            🎉 Order placed successfully! Your items are being processed.
          </div>
        )}

        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem'}}>
          <div>
            <h1 style={{fontSize:'1.5rem', fontWeight:700}}>Order Details</h1>
            <div style={{fontSize:'0.85rem', color:'var(--text-muted)', marginTop:'0.25rem'}}>
              #{order._id.toUpperCase()} · {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
          <span className={`badge ${STATUS_CLASS[order.status]}`} style={{fontSize:'0.9rem', padding:'0.35rem 0.9rem'}}>
            {order.status}
          </span>
        </div>

        {/* Store Info */}
        <div className="card" style={{marginBottom:'1rem'}}>
          <div style={{fontWeight:600, marginBottom:'0.25rem'}}>🏪 Store</div>
          <div style={{color:'var(--text-muted)'}}>{order.adminId?.storeName}</div>
        </div>

        {/* Order Items */}
        <div className="card" style={{marginBottom:'1rem'}}>
          <h3 style={{fontWeight:700, marginBottom:'1rem'}}>Items Ordered</h3>
          {order.items.map((item, idx) => (
            <div key={idx} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.75rem 0', borderBottom: idx < order.items.length - 1 ? '1px solid var(--border)' : 'none'}}>
              <div style={{display:'flex', gap:'0.75rem', alignItems:'center'}}>
                <img
                  src={item.productId?.image || PLACEHOLDER_IMAGE}
                  alt={item.productId?.name}
                  style={{width:'50px', height:'50px', objectFit:'cover', borderRadius:'6px', flexShrink:0}}
                  onError={handleImageError}
                />
                <div>
                  <div style={{fontWeight:600, fontSize:'0.9rem'}}>{item.productId?.name || 'Product'}</div>
                  <div style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>
                    ${item.price.toFixed(2)} × {item.quantity}
                  </div>
                </div>
              </div>
              <div style={{fontWeight:700}}>${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
          <div style={{display:'flex', justifyContent:'space-between', marginTop:'1rem', fontWeight:800, fontSize:'1.1rem', padding:'0.75rem 0', borderTop:'2px solid var(--border)'}}>
            <span>Total</span>
            <span style={{color:'var(--primary-light)'}}>${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div style={{display:'flex', gap:'0.75rem', marginTop:'0.5rem'}}>
          <Link to="/my-orders" className="btn btn-ghost">← My Orders</Link>
          <Link to="/stores" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
