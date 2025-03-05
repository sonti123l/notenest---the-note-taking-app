const express = require('express');
const connectDB = require('./config/dbConnection'); // Database connection
const cors = require('cors');
const morgan = require('morgan'); // For logging requests (optional)
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');
const errorHandler = require('./middleware/errorHandler'); // Centralized error handling

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Logs API requests

// Connect Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
