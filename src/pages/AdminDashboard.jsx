import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyProducts, getMyCategories, getStoreOrders, getStoreRatings } from '../services/api';

export default function AdminDashboard() {
  const { admin } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    revenue: 0,
    ratings: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyProducts(), getMyCategories(), getStoreOrders(), getStoreRatings()])
      .then(([prodsRes, catsRes, ordersRes, ratingsRes]) => {
        const orders = ordersRes.data;
        const revenue = orders
          .filter((o) => o.status !== 'Cancelled')
          .reduce((sum, o) => sum + o.totalAmount, 0);

        setStats({
          products: prodsRes.data.length,
          categories: catsRes.data.length,
          orders: orders.length,
          revenue,
          ratings: ratingsRes.data.length,
        });
        setRecentOrders(orders.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="spinner-wrap" style={{ marginTop: '5rem' }}>
        <div className="spinner"></div>
      </div>
    );

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page-header-inner" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>
              🏪 {admin?.storeName} Dashboard
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Logged in as <strong style={{ color: 'var(--text)' }}>{admin?.name}</strong> ({admin?.email})
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/admin/products/new" className="btn btn-primary">
              + Add Product
            </Link>
            <Link to={`/store/${admin?._id}`} className="btn btn-ghost" target="_blank">
              View Store Front ↗
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>
              ${stats.revenue.toFixed(2)}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-label">Products</div>
            <div className="stat-value">{stats.products}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📑</div>
            <div className="stat-label">Categories</div>
            <div className="stat-value">{stats.categories}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🛒</div>
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{stats.orders}</div>
          </div>
        </div>

        {/* Quick Links & Recent Orders */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
          {/* Recent Orders Table */}
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 style={{ fontWeight: 700 }}>Recent Orders</h3>
              <Link to="/admin/orders" className="btn btn-ghost btn-sm">
                View All →
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '1rem 0' }}>
                No orders received yet.
              </p>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td style={{ fontWeight: 600 }}>#{order._id.slice(-6).toUpperCase()}</td>
                        <td>{order.userId?.name || 'Customer'}</td>
                        <td style={{ fontWeight: 700 }}>${order.totalAmount.toFixed(2)}</td>
                        <td>
                          <span className={`badge status-${order.status}`}>{order.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Store Actions Panel */}
          <div className="card flex-col gap-2">
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Store Management</h3>
            <Link to="/admin/products" className="btn btn-ghost btn-full" style={{ justifyContent: 'flex-start' }}>
              📦 Manage Products
            </Link>
            <Link to="/admin/categories" className="btn btn-ghost btn-full" style={{ justifyContent: 'flex-start' }}>
              📑 Manage Categories
            </Link>
            <Link to="/admin/orders" className="btn btn-ghost btn-full" style={{ justifyContent: 'flex-start' }}>
              🛒 Manage Orders
            </Link>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Store ID for reference:</div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--primary-light)', wordBreak: 'break-all' }}>
                {admin?._id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
