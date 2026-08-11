// Utility for handling image errors safely without infinite loops or external network calls
export const PLACEHOLDER_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%231e293b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="18">No Image Available</text></svg>`;

export const handleImageError = (e) => {
  e.target.onerror = null; // CRITICAL: Stop infinite loop if placeholder ever fails
  e.target.src = PLACEHOLDER_IMAGE;
};
