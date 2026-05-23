const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const datasetRouter = require('./routes/datasetRoutes');
const searchRouter = require('./routes/searchRoutes');
const analyticsRouter = require('./routes/analyticsRoutes');
const statsRouter = require('./routes/statsRoutes');
const authRouter = require('./routes/authRoutes');
const jwtRouter = require('./routes/jwtRoutes');

// Load environment variables
dotenv.config({ path: './.env' });

const { apiLimiter } = require('./middlewares/rateLimiter');

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use('/api', apiLimiter);


// Custom Request Logging Middleware (Good to Have 2)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Request logging timestamp middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`[Request] ${req.method} ${req.originalUrl} - Received at ${req.requestTime}`);
  next();
});

// Mount Routes (Good to Have 13: Versioned API structure)
app.use('/api/v1/datasets', datasetRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/stats', statsRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jwt', jwtRouter);

// Health Check API (Good to Have 15)
app.get('/api/v1/system/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime()
  });
});

// Fallback route for undefined paths
app.use('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  next(err);
});

// Global Error Handler Middleware (Good to Have 3)
app.use(require('./middlewares/errorMiddleware'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
