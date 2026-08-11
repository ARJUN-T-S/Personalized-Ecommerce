import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyCategories, createProduct } from '../services/api';

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    image: '',
  });

  useEffect(() => {
    getMyCategories()
      .then((r) => {
        setCategories(r.data);
        if (r.data.length > 0) setForm((f) => ({ ...f, categoryId: r.data[0]._id }));
      })
      .catch(() => setError('Failed to load store categories.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryId) {
      setError('Please select or create a category first.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      await createProduct({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10) || 0,
      });
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product.');
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="spinner-wrap" style={{ marginTop: '5rem' }}>
        <div className="spinner"></div>
      </div>
    );

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '650px' }}>
        <div className="breadcrumb">
          <Link to="/admin/dashboard">Admin</Link>
          <span>/</span>
          <Link to="/admin/products">Products</Link>
          <span>/</span>
          <span>Add Product</span>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          + Add New Product
        </h1>

        {error && <div className="alert alert-danger">{error}</div>}

        {categories.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>No categories available</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              You need at least one category before adding products.
            </p>
            <Link to="/admin/categories" className="btn btn-primary">
              + Create Category First
            </Link>
          </div>
        ) : (
          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  id="prod-name"
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Wireless Noise-Cancelling Headphones"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    id="prod-category"
                    name="categoryId"
                    className="form-control"
                    value={form.categoryId}
                    onChange={handleChange}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price ($) *</label>
                  <input
                    id="prod-price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    placeholder="99.99"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input
                    id="prod-stock"
                    name="stock"
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="10"
                    value={form.stock}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    id="prod-image"
                    name="image"
                    type="url"
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                    value={form.image}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  id="prod-desc"
                  name="description"
                  className="form-control"
                  placeholder="Product description and details..."
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Create Product'}
                </button>
                <Link to="/admin/products" className="btn btn-ghost btn-lg">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
