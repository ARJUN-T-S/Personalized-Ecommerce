import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, getProductRatings, createRating, updateRating, deleteRating, addToCart } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import { handleImageError, PLACEHOLDER_IMAGE } from '../utils/imageUtils';

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartMsg, setCartMsg] = useState('');
  const [cartSuccess, setCartSuccess] = useState(false);
  const [qty, setQty] = useState(1);

  // Rating form state
  const [myRating, setMyRating] = useState(null);
  const [ratingVal, setRatingVal] = useState(0);
  const [comment, setComment] = useState('');
  const [ratingMsg, setRatingMsg] = useState('');
  const [editMode, setEditMode] = useState(false);

  const loadRatings = async () => {
    const res = await getProductRatings(id);
    setRatings(res.data);
    if (user) {
      const mine = res.data.find(r => r.userId?._id === user._id || r.userId === user._id);
      setMyRating(mine || null);
      if (mine) { setRatingVal(mine.rating); setComment(mine.comment || ''); }
    }
  };

  useEffect(() => {
    Promise.all([getProductById(id), getProductRatings(id)])
      .then(([pRes, rRes]) => {
        setProduct(pRes.data);
        setRatings(rRes.data);
        if (user) {
          const mine = rRes.data.find(r => r.userId?._id === user._id || r.userId === user._id);
          setMyRating(mine || null);
          if (mine) { setRatingVal(mine.rating); setComment(mine.comment || ''); }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, user]);

  const getStoreId = () => {
    if (!product) return null;
    const store = product.adminId;
    if (typeof store === 'object' && store?._id) return store._id;
    return store;
  };

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    const storeId = getStoreId();
    try {
      await addToCart({ adminId: storeId, productId: id, quantity: qty });
      setCartMsg('Added to cart successfully! ✓');
      setCartSuccess(true);
    } catch (err) {
      setCartSuccess(false);
      setCartMsg(err.response?.data?.message || 'Error adding to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!user) { navigate('/login'); return; }
    const storeId = getStoreId();
    try {
      await addToCart({ adminId: storeId, productId: id, quantity: qty });
      navigate(`/checkout?store=${storeId}`);
    } catch (err) {
      setCartSuccess(false);
      setCartMsg(err.response?.data?.message || 'Error adding to cart');
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!ratingVal) { setRatingMsg('Please select a star rating'); return; }
    try {
      if (editMode && myRating) {
        await updateRating(myRating._id, { rating: ratingVal, comment });
        setRatingMsg('Review updated!');
      } else {
        await createRating({ productId: id, rating: ratingVal, comment });
        setRatingMsg('Review submitted!');
      }
      setEditMode(false);
      await loadRatings();
      setTimeout(() => setRatingMsg(''), 3000);
    } catch (err) {
      setRatingMsg(err.response?.data?.message || 'Error submitting review');
    }
  };

  const handleDeleteRating = async () => {
    if (!myRating) return;
    await deleteRating(myRating._id);
    setMyRating(null); setRatingVal(0); setComment(''); setEditMode(false);
    await loadRatings();
  };

  const avgRating = ratings.length ? (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1) : null;

  if (loading) return <div className="spinner-wrap" style={{marginTop:'5rem'}}><div className="spinner"></div></div>;
  if (!product) return <div className="container page"><div className="alert alert-danger">Product not found.</div></div>;

  const storeId = getStoreId();

  return (
    <div className="page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/stores">Stores</Link>
          <span>/</span>
          <Link to={`/store/${storeId}`}>{product.adminId?.storeName || 'Store'}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        {/* Product Info */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'3rem', marginBottom:'3rem'}}>
          <div>
            <img
              src={product.image || PLACEHOLDER_IMAGE}
              alt={product.name}
              style={{width:'100%', borderRadius:'var(--radius-lg)', border:'1px solid var(--border)', maxHeight:'450px', objectFit:'cover'}}
              onError={handleImageError}
            />
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
            <div>
              <span className="badge badge-primary">{product.categoryId?.name}</span>
              <h1 style={{fontSize:'1.75rem', fontWeight:700, marginTop:'0.75rem'}}>{product.name}</h1>
            </div>
            {avgRating && (
              <div style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
                <StarRating rating={Math.round(avgRating)} readonly size="1.2rem" />
                <span style={{color:'var(--text-muted)', fontSize:'0.9rem'}}>{avgRating} ({ratings.length} reviews)</span>
              </div>
            )}
            <div style={{fontSize:'2rem', fontWeight:800, color:'var(--primary-light)'}}>
              ${product.price.toFixed(2)}
            </div>
            <div>
              {product.stock > 0 ? (
                <span className="badge badge-success" style={{fontSize:'0.85rem', padding:'0.3rem 0.8rem'}}>✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="badge badge-danger" style={{fontSize:'0.85rem', padding:'0.3rem 0.8rem'}}>✗ Out of Stock</span>
              )}
            </div>
            {product.description && (
              <p style={{color:'var(--text-muted)', lineHeight:'1.7'}}>{product.description}</p>
            )}

            {product.stock > 0 && (
              <div style={{display:'flex', gap:'1rem', alignItems:'center', flexWrap:'wrap', marginTop:'0.5rem'}}>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-num">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
                <button className="btn btn-primary btn-lg" onClick={handleAddToCart} style={{flex:1}}>
                  🛒 Add to Cart
                </button>
                <button className="btn btn-accent btn-lg" onClick={handleBuyNow}>
                  ⚡ Buy Now
                </button>
              </div>
            )}

            {cartMsg && (
              <div className={`alert ${cartSuccess ? 'alert-success' : 'alert-danger'}`} style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'0.5rem'}}>
                <span>{cartMsg}</span>
                {cartSuccess && (
                  <div style={{display:'flex', gap:'0.5rem'}}>
                    <Link to={`/cart?store=${storeId}`} className="btn btn-ghost btn-sm">View Cart</Link>
                    <Link to={`/checkout?store=${storeId}`} className="btn btn-primary btn-sm">Checkout →</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Ratings Section */}
        <div style={{borderTop:'1px solid var(--border)', paddingTop:'2rem'}}>
          <h2 style={{fontSize:'1.3rem', fontWeight:700, marginBottom:'1.5rem'}}>
            Customer Reviews {ratings.length > 0 && <span style={{color:'var(--text-muted)', fontSize:'1rem'}}>({ratings.length})</span>}
          </h2>

          {/* Write Review */}
          {user && !myRating && !editMode && (
            <div className="card" style={{marginBottom:'1.5rem'}}>
              <h3 style={{fontSize:'1rem', fontWeight:600, marginBottom:'1rem'}}>Write a Review</h3>
              <form onSubmit={handleSubmitRating}>
                <div className="form-group">
                  <label className="form-label">Your Rating</label>
                  <StarRating rating={ratingVal} onChange={setRatingVal} size="1.5rem" />
                </div>
                <div className="form-group">
                  <label className="form-label">Comment (optional)</label>
                  <textarea className="form-control" value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your thoughts..." rows={3} />
                </div>
                {ratingMsg && <div className={`alert ${ratingMsg.includes('!') ? 'alert-success' : 'alert-danger'}`}>{ratingMsg}</div>}
                <button type="submit" className="btn btn-primary">Submit Review</button>
              </form>
            </div>
          )}

          {/* My Review */}
          {user && myRating && !editMode && (
            <div className="rating-card" style={{border:'1px solid var(--primary)', marginBottom:'1.5rem', background:'rgba(108,99,255,0.05)'}}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.5rem'}}>
                <div>
                  <StarRating rating={myRating.rating} readonly />
                  <div className="rating-author" style={{marginTop:'0.25rem'}}>Your Review</div>
                </div>
                <div style={{display:'flex', gap:'0.5rem'}}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditMode(true)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={handleDeleteRating}>Delete</button>
                </div>
              </div>
              {myRating.comment && <div className="rating-comment">{myRating.comment}</div>}
            </div>
          )}

          {/* Edit My Review */}
          {user && myRating && editMode && (
            <div className="card" style={{marginBottom:'1.5rem'}}>
              <h3 style={{fontSize:'1rem', fontWeight:600, marginBottom:'1rem'}}>Edit Your Review</h3>
              <form onSubmit={handleSubmitRating}>
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <StarRating rating={ratingVal} onChange={setRatingVal} size="1.5rem" />
                </div>
                <div className="form-group">
                  <label className="form-label">Comment</label>
                  <textarea className="form-control" value={comment} onChange={e => setComment(e.target.value)} rows={3} />
                </div>
                {ratingMsg && <div className={`alert ${ratingMsg.includes('!') ? 'alert-success' : 'alert-danger'}`}>{ratingMsg}</div>}
                <div style={{display:'flex', gap:'0.5rem'}}>
                  <button type="submit" className="btn btn-primary">Update</button>
                  <button type="button" className="btn btn-ghost" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {!user && (
            <div className="alert alert-info" style={{marginBottom:'1.5rem'}}>
              <Link to="/login" style={{color:'var(--primary-light)'}}>Login</Link> to write a review.
            </div>
          )}

          {/* All Ratings */}
          {ratings.filter(r => r.userId?._id !== user?._id && r.userId !== user?._id).map(r => (
            <div key={r._id} className="rating-card">
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.35rem'}}>
                <StarRating rating={r.rating} readonly />
                <span className="rating-date">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="rating-author">{r.userId?.name || 'User'}</div>
              {r.comment && <div className="rating-comment">{r.comment}</div>}
            </div>
          ))}

          {ratings.length === 0 && (
            <p style={{color:'var(--text-muted)'}}>No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  );
}
