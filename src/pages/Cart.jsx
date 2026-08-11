import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCart, getMyCarts, updateCartItem, removeCartItem, clearCart } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { handleImageError, PLACEHOLDER_IMAGE } from '../utils/imageUtils';

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // adminId from query param: /cart?store=<adminId>
  const searchParams = new URLSearchParams(location.search);
  const selectedAdminId = searchParams.get('store');

  const [carts, setCarts] = useState([]);
  const [activeCart, setActiveCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      if (selectedAdminId) {
        const res = await getCart(selectedAdminId);
        setActiveCart(res.data);
      } else {
        const res = await getMyCarts();
        // Filter active non-empty carts
        const active = res.data.filter(c => c.items && c.items.length > 0);
        setCarts(active);
        if (active.length === 1) {
          setActiveCart(active[0]);
        }
      }
    } catch {
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [selectedAdminId]);

  const handleUpdateQty = async (adminId, productId, qty) => {
    try {
      await updateCartItem(adminId, productId, qty);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleRemove = async (adminId, productId) => {
    try {
      await removeCartItem(adminId, productId);
      await loadData();
    } catch {
      setError('Remove failed');
    }
  };

  const handleClear = async (adminId) => {
    await clearCart(adminId);
    await loadData();
  };

  if (loading) return <div className="spinner-wrap" style={{marginTop:'5rem'}}><div className="spinner"></div></div>;

  // Case 1: Specific store cart view (or auto-selected single cart)
  if (selectedAdminId || activeCart) {
    const cartObj = activeCart || carts.find(c => c.adminId?._id === selectedAdminId || c.adminId === selectedAdminId);
    const storeId = selectedAdminId || cartObj?.adminId?._id || cartObj?.adminId;
    const items = cartObj?.items || [];
    const total = cartObj?.totalAmount || 0;

    return (
      <div className="page">
        <div className="container">
          <div className="page-header-inner" style={{marginBottom:'2rem'}}>
            <div>
              <h1 style={{fontSize:'1.75rem', fontWeight:700}}>🛒 Shopping Cart</h1>
              {cartObj?.adminId?.storeName && (
                <p style={{color:'var(--text-muted)'}}>Store: {cartObj.adminId.storeName}</p>
              )}
            </div>
            {items.length > 0 && (
              <div style={{display:'flex', gap:'0.5rem'}}>
                {!selectedAdminId && carts.length > 1 && (
                  <button className="btn btn-ghost btn-sm" onClick={() => setActiveCart(null)}>All Carts</button>
                )}
                <button className="btn btn-ghost btn-sm" onClick={() => handleClear(storeId)}>Clear Cart</button>
              </div>
            )}
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {msg && <div className="alert alert-success">{msg}</div>}

          {items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Add some products from this store.</p>
              <Link to="/stores" className="btn btn-primary">Browse Stores</Link>
            </div>
          ) : (
            <div style={{display:'grid', gridTemplateColumns:'1fr 340px', gap:'2rem', alignItems:'start'}}>
              {/* Cart Items */}
              <div>
                {items.map(item => {
                  const product = item.productId;
                  return (
                    <div key={product?._id || item.productId} className="card" style={{display:'flex', gap:'1.25rem', alignItems:'center', marginBottom:'1rem'}}>
                      <img
                        src={product?.image || PLACEHOLDER_IMAGE}
                        alt={product?.name}
                        style={{width:'80px', height:'80px', objectFit:'cover', borderRadius:'var(--radius-sm)', flexShrink:0}}
                        onError={handleImageError}
                      />
                      <div style={{flex:1, minWidth:0}}>
                        <div style={{fontWeight:600, marginBottom:'0.25rem'}}>{product?.name || 'Product'}</div>
                        <div style={{color:'var(--primary-light)', fontWeight:700}}>${item.price.toFixed(2)} each</div>
                      </div>
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => handleUpdateQty(storeId, product?._id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                        <span className="qty-num">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => handleUpdateQty(storeId, product?._id, item.quantity + 1)} disabled={item.quantity >= (product?.stock || 99)}>+</button>
                      </div>
                      <div style={{fontWeight:700, minWidth:'70px', textAlign:'right'}}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button className="btn btn-danger btn-sm" onClick={() => handleRemove(storeId, product?._id)}>✕</button>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="card" style={{position:'sticky', top:'90px'}}>
                <h3 style={{fontWeight:700, marginBottom:'1.25rem'}}>Order Summary</h3>
                {items.map(item => (
                  <div key={item.productId?._id || item.productId} style={{display:'flex', justifyContent:'space-between', marginBottom:'0.6rem', fontSize:'0.875rem'}}>
                    <span style={{color:'var(--text-muted)'}}>{item.productId?.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{borderTop:'1px solid var(--border)', paddingTop:'1rem', marginTop:'0.5rem'}}>
                  <div style={{display:'flex', justifyContent:'space-between', fontWeight:700, fontSize:'1.1rem'}}>
                    <span>Total</span>
                    <span style={{color:'var(--primary-light)'}}>${total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  className="btn btn-accent btn-full btn-lg"
                  style={{marginTop:'1.25rem'}}
                  onClick={() => navigate(`/checkout?store=${storeId}`)}
                >
                  Proceed to Checkout →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Case 2: Multi-store Carts Overview (when /cart visited with no ?store= param)
  return (
    <div className="page">
      <div className="container">
        <h1 style={{fontSize:'1.75rem', fontWeight:700, marginBottom:'2rem'}}>🛒 Your Shopping Carts</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        {carts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3>Your shopping cart is empty</h3>
            <p>Browse available stores and add items to your cart.</p>
            <Link to="/stores" className="btn btn-primary">Browse Stores</Link>
          </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:'2rem'}}>
            {carts.map(cart => (
              <div key={cart._id} className="card">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem', borderBottom:'1px solid var(--border)', paddingBottom:'0.75rem'}}>
                  <div>
                    <h2 style={{fontSize:'1.25rem', fontWeight:700}}>🏪 {cart.adminId?.storeName || 'Store'}</h2>
                    <span style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>{cart.items.length} item(s)</span>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleClear(cart.adminId?._id || cart.adminId)}>Clear Store Cart</button>
                </div>

                <div style={{display:'flex', flexDirection:'column', gap:'0.75rem', marginBottom:'1.5rem'}}>
                  {cart.items.map(item => (
                    <div key={item.productId?._id || item.productId} style={{display:'flex', gap:'1rem', alignItems:'center', justifyContent:'space-between'}}>
                      <div style={{display:'flex', gap:'0.75rem', alignItems:'center'}}>
                        <img
                          src={item.productId?.image || PLACEHOLDER_IMAGE}
                          alt={item.productId?.name}
                          style={{width:'50px', height:'50px', objectFit:'cover', borderRadius:'6px'}}
                          onError={handleImageError}
                        />
                        <div>
                          <div style={{fontWeight:600}}>{item.productId?.name}</div>
                          <div style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>${item.price.toFixed(2)} × {item.quantity}</div>
                        </div>
                      </div>
                      <div style={{fontWeight:700}}>${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid var(--border)', paddingTop:'1rem'}}>
                  <div>
                    <span style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>Store Total: </span>
                    <span style={{fontSize:'1.25rem', fontWeight:800, color:'var(--primary-light)'}}>${cart.totalAmount.toFixed(2)}</span>
                  </div>
                  <button
                    className="btn btn-accent btn-lg"
                    onClick={() => navigate(`/checkout?store=${cart.adminId?._id || cart.adminId}`)}
                  >
                    Proceed to Checkout →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
