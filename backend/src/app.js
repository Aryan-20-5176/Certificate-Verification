const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Test Route
app.get('/', (req, res) => {
  res.send('VeriTrust Portal API is running...');
});

// Error Handler Middleware
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
