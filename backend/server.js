const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./src/config/db');

const authRoutes = require('./src/routes/auth');
const recipeRoutes = require('./src/routes/recipes');
const favoriteRoutes = require('./src/routes/favorites');
const paymentRoutes = require('./src/routes/payments');
const userRoutes = require('./src/routes/users');
const adminRoutes = require('./src/routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// CORS configuration
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RecipeHub Backend API is running running smoothly!' });
});

// Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ success: false, message: 'Server error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 RecipeHub Backend Server running on port ${PORT}`);
});
