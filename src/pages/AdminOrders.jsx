import { useState, useEffect } from 'react';
import { getStoreOrders, updateOrderStatus, deleteOrder } from '../services/api';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const loadOrders = async () => {
    try {
      const res = await getStoreOrders();
      setOrders(res.data);
    } catch {
      setError('Failed to load store orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setMsg(`Order #${orderId.slice(-6).toUpperCase()} status updated to "${newStatus}".`);
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm(`Delete order #${orderId.slice(-6).toUpperCase()}?`)) return;
    try {
      await deleteOrder(orderId);
      setMsg(`Order deleted.`);
      setOrders(orders.filter((o) => o._id !== orderId));
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete order.');
    }
  };

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page-header-inner" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>🛒 Store Orders</h1>
            <p style={{ color: 'var(--text-muted)' }}>View and manage customer orders placed at your store</p>
          </div>
        </div>

        {msg && <div className="alert alert-success">{msg}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="spinner-wrap">
            <div className="spinner"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3>No orders received</h3>
            <p>Orders placed by customers for your products will show up here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((order) => (
              <div key={order._id} className="card">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginBottom: '1rem',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '0.75rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                      Order #{order._id.toUpperCase()}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Customer: <strong>{order.userId?.name || 'Customer'}</strong> ({order.userId?.email || 'N/A'}) ·{' '}
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status:</label>
                    <select
                      className="form-control"
                      style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(order._id)}
                      title="Delete order"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
                  <div>
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--text)',
                          padding: '0.25rem 0',
                          display: 'flex',
                          gap: '0.5rem',
                        }}
                      >
                        <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>
                          {item.quantity}x
                        </span>
                        <span>{item.productId?.name || 'Product'}</span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          (${item.price.toFixed(2)} ea)
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>
                      ${order.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
