export default function StarRating({ rating, onChange, readonly = false, size = '1.1rem' }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="stars" style={{ fontSize: size }}>
      {stars.map((s) => (
        <span
          key={s}
          className={`star ${s <= rating ? 'star-filled' : 'star-empty'}`}
          onClick={() => !readonly && onChange && onChange(s)}
          style={{ cursor: readonly ? 'default' : 'pointer' }}
          title={readonly ? '' : `Rate ${s} star${s > 1 ? 's' : ''}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}
