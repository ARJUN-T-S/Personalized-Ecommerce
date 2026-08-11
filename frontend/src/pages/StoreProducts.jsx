import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductsByStore, getCategoriesByStore, getAdminById, addToCart } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { handleImageError, PLACEHOLDER_IMAGE } from '../utils/imageUtils';

export default function StoreProducts() {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [store, setStore] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [cartFeedback, setCartFeedback] = useState({});

  useEffect(() => {
    Promise.all([
      getAdminById(adminId),
      getCategoriesByStore(adminId),
      getProductsByStore(adminId),
    ])
      .then(([storeRes, catsRes, prodsRes]) => {
        setStore(storeRes.data);
        setCategories(catsRes.data);
        setProducts(prodsRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [adminId]);

  const handleCategoryFilter = async (catId) => {
    setActiveCategory(catId);
    const res = await getProductsByStore(adminId, catId || undefined);
    setProducts(res.data);
  };

  const handleQuickAdd = async (e, product) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    try {
      await addToCart({ adminId, productId: product._id, quantity: 1 });
      setCartFeedback(prev => ({ ...prev, [product._id]: '✓ Added!' }));
      setTimeout(() => {
        setCartFeedback(prev => ({ ...prev, [product._id]: null }));
      }, 2000);
    } catch (err) {
      setCartFeedback(prev => ({ ...prev, [product._id]: err.response?.data?.message || 'Failed' }));
      setTimeout(() => {
        setCartFeedback(prev => ({ ...prev, [product._id]: null }));
      }, 3000);
    }
  };

  const filtered = activeCategory
    ? products.filter(p => p.categoryId?._id === activeCategory || p.categoryId === activeCategory)
    : products;

  if (loading) return <div className="spinner-wrap" style={{marginTop:'5rem'}}><div className="spinner"></div></div>;

  return (
    <div className="page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/stores">Stores</Link>
          <span>/</span>
          <span>{store?.storeName}</span>
        </div>

        {/* Store Header */}
        <div className="page-header-inner" style={{marginBottom:'2rem'}}>
          <div>
            <h1 style={{fontSize:'1.75rem', fontWeight:700}}>{store?.storeName}</h1>
            <p style={{color:'var(--text-muted)'}}>by {store?.name} · {products.length} products</p>
          </div>
          {user && (
            <Link to={`/cart?store=${adminId}`} className="btn btn-ghost btn-sm">
              🛒 View Store Cart
            </Link>
          )}
        </div>

        {/* Category Tabs */}
        {categories.length > 0 && (
          <div className="category-tabs">
            <button className={`cat-tab ${activeCategory === '' ? 'active' : ''}`} onClick={() => handleCategoryFilter('')}>All</button>
            {categories.map(cat => (
              <button key={cat._id} className={`cat-tab ${activeCategory === cat._id ? 'active' : ''}`} onClick={() => handleCategoryFilter(cat._id)}>
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No products found</h3>
            <p>Try a different category or come back later.</p>
          </div>
        ) : (
          <div className="grid-4">
            {filtered.map(product => (
              <div key={product._id} className="product-card" onClick={() => navigate(`/product/${product._id}`)}>
                <img
                  src={product.image || PLACEHOLDER_IMAGE}
                  alt={product.name}
                  onError={handleImageError}
                />
                <div className="product-card-body">
                  <div className="product-card-category">{product.categoryId?.name}</div>
                  <div className="product-card-name">{product.name}</div>
                  <div className="product-card-price">${product.price.toFixed(2)}</div>
                  <div className="product-card-stock" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'0.5rem'}}>
                    {product.stock > 0 ? (
                      <span style={{color:'var(--success)', fontSize:'0.85rem'}}>✓ In stock ({product.stock})</span>
                    ) : (
                      <span style={{color:'var(--danger-light)', fontSize:'0.85rem'}}>Out of stock</span>
                    )}
                    {product.stock > 0 && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => handleQuickAdd(e, product)}
                        style={{padding:'0.25rem 0.6rem', fontSize:'0.8rem'}}
                      >
                        {cartFeedback[product._id] || '+ Add'}
                      </button>
                    )}
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
