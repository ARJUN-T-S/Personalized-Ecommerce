const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const setupSwagger = require('./config/swagger');

dotenv.config();

// Initialize DB connection
connectDB();

const app = express();

// Ensure DB connection for serverless invocations
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Mount Swagger Documentation UI
setupSwagger(app);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admins', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/carts', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/ratings', require('./routes/ratingRoutes'));

// Root health & info endpoint (Fixes deployment platform root 404 health check failures)
app.get('/', (req, res) => res.json({
  status: 'OK',
  message: 'MERN Multi-Store E-Commerce API Server Running',
  documentation: '/api-docs',
  health: '/api/health'
}));

// Health check endpoint
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Server is healthy' }));

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Standalone Server binding (Render, Railway, Heroku, VPS, Docker, etc.)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
