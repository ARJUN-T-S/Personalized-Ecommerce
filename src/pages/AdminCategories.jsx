import { useState, useEffect } from 'react';
import { getMyCategories, createCategory, updateCategory, deleteCategory } from '../services/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  // Form modal / inline state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await getMyCategories();
      setCategories(res.data);
    } catch {
      setError('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
    setDescription(cat.description || '');
  };

  const handleCancel = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError('');

    try {
      if (editingId) {
        await updateCategory(editingId, { name, description });
        setMsg(`Category "${name}" updated.`);
      } else {
        await createCategory({ name, description });
        setMsg(`Category "${name}" created.`);
      }
      handleCancel();
      await loadCategories();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Delete category "${catName}"?`)) return;
    try {
      await deleteCategory(id);
      setMsg(`Category "${catName}" deleted.`);
      setCategories(categories.filter((c) => c._id !== id));
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category.');
    }
  };

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page-header-inner" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>📑 Store Categories</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage product categories for your store</p>
          </div>
        </div>

        {msg && <div className="alert alert-success">{msg}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Create / Edit Form */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>
              {editingId ? '✏️ Edit Category' : '+ Add Category'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input
                  id="cat-name"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Laptops"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description (optional)</label>
                <textarea
                  id="cat-desc"
                  className="form-control"
                  placeholder="Short description of items in this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                  {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-ghost" onClick={handleCancel}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Categories List */}
          <div>
            {loading ? (
              <div className="spinner-wrap">
                <div className="spinner"></div>
              </div>
            ) : categories.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-state-icon">📑</div>
                <h3>No categories yet</h3>
                <p>Use the form on the left to add your first store category.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Created</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat._id}>
                        <td style={{ fontWeight: 600 }}>{cat.name}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {cat.description || '—'}
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          {new Date(cat.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(cat)}>
                              ✏️ Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(cat._id, cat.name)}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
