import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getProductById, getMyCategories, updateProduct } from '../services/api';

export default function EditProduct() {
  const { id } = useParams();
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
    Promise.all([getProductById(id), getMyCategories()])
      .then(([prodRes, catRes]) => {
        setCategories(catRes.data);
        const p = prodRes.data;
        setForm({
          name: p.name || '',
          description: p.description || '',
          price: p.price !== undefined ? p.price : '',
          stock: p.stock !== undefined ? p.stock : '',
          categoryId: p.categoryId?._id || p.categoryId || '',
          image: p.image || '',
        });
      })
      .catch(() => setError('Failed to load product data.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await updateProduct(id, {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10) || 0,
      });
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product.');
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
          <span>Edit Product</span>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          ✏️ Edit Product
        </h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input
                id="edit-prod-name"
                name="name"
                type="text"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  id="edit-prod-category"
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
                  id="edit-prod-price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control"
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
                  id="edit-prod-stock"
                  name="stock"
                  type="number"
                  min="0"
                  className="form-control"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  id="edit-prod-image"
                  name="image"
                  type="url"
                  className="form-control"
                  value={form.image}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                id="edit-prod-desc"
                name="description"
                className="form-control"
                value={form.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                {submitting ? 'Updating...' : 'Update Product'}
              </button>
              <Link to="/admin/products" className="btn btn-ghost btn-lg">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
