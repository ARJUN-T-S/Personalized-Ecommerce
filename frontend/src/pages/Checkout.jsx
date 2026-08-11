import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCart, getMyCarts, placeOrder, getAdminById } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { handleImageError, PLACEHOLDER_IMAGE } from '../utils/imageUtils';

export default function Checkout() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialAdminId = searchParams.get('store');

  const [adminId, setAdminId] = useState(initialAdminId);
  const [cart, setCart] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Shipping details state
  const [shippingAddress, setShippingAddress] = useState('123 Main Street, Apt 4B');
  const [phone, setPhone] = useState(user?.phone || '555-0199');

  useEffect(() => {
    const loadCheckoutData = async () => {
      setLoading(true);
      setError('');
      try {
        let currentStoreId = adminId;
        if (!currentStoreId) {
          const cartsRes = await getMyCarts();
          const activeCarts = cartsRes.data.filter(c => c.items && c.items.length > 0);
          if (activeCarts.length > 0) {
            currentStoreId = activeCarts[0].adminId?._id || activeCarts[0].adminId;
            setAdminId(currentStoreId);
          } else {
            setLoading(false);
            return;
          }
        }

        const [cartRes, storeRes] = await Promise.all([
          getCart(currentStoreId),
          getAdminById(currentStoreId),
        ]);
        setCart(cartRes.data);
        setStore(storeRes.data);
      } catch {
        setError('Failed to load checkout data');
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [adminId]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!adminId) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await placeOrder(adminId);
      navigate(`/order/${res.data._id}?placed=true`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner-wrap" style={{marginTop:'5rem'}}><div className="spinner"></div></div>;

  const items = cart?.items || [];

  return (
    <div className="page">
      <div className="container" style={{maxWidth:'750px'}}>
        <h1 style={{fontSize:'1.75rem', fontWeight:700, marginBottom:'2rem'}}>✅ Complete Your Order</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Select products from a store to proceed with checkout.</p>
            <button className="btn btn-primary" onClick={() => navigate('/stores')}>Browse Stores</button>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder}>
            {/* Store & Order Items */}
            <div className="card" style={{marginBottom:'1.5rem'}}>
              <h3 style={{fontWeight:700, marginBottom:'1rem'}}>🏪 Store: {store?.storeName}</h3>
              {items.map(item => (
                <div key={item.productId?._id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.75rem 0', borderBottom:'1px solid var(--border)'}}>
                  <div style={{display:'flex', gap:'0.75rem', alignItems:'center'}}>
                    <img
                      src={item.productId?.image || PLACEHOLDER_IMAGE}
                      alt={item.productId?.name}
                      style={{width:'50px', height:'50px', objectFit:'cover', borderRadius:'6px'}}
                      onError={handleImageError}
                    />
                    <div>
                      <div style={{fontWeight:600, fontSize:'0.9rem'}}>{item.productId?.name}</div>
                      <div style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>Qty: {item.quantity} × ${item.price.toFixed(2)}</div>
                    </div>
                  </div>
                  <div style={{fontWeight:700}}>${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
              <div style={{display:'flex', justifyContent:'space-between', marginTop:'1rem', fontWeight:800, fontSize:'1.2rem'}}>
                <span>Total Amount</span>
                <span style={{color:'var(--primary-light)'}}>${cart?.totalAmount?.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping & Contact Info */}
            <div className="card" style={{marginBottom:'1.5rem'}}>
              <h3 style={{fontWeight:700, marginBottom:'1rem'}}>📍 Delivery Information</h3>
              <div className="form-group" style={{marginBottom:'1rem'}}>
                <label className="form-label">Delivery Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={shippingAddress}
                  onChange={e => setShippingAddress(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="alert alert-info" style={{marginBottom:'1.5rem'}}>
              ℹ️ Cash on Delivery / Standard Order Processing. Stock will be verified before order creation.
            </div>

            <button type="submit" className="btn btn-accent btn-full btn-lg" disabled={submitting}>
              {submitting ? 'Placing Order...' : '🎉 Confirm & Place Order'}
            </button>
            <button type="button" className="btn btn-ghost btn-full" style={{marginTop:'0.75rem'}} onClick={() => navigate(`/cart?store=${adminId}`)}>
              ← Back to Cart
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
