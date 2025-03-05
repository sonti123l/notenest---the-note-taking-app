const express = require('express');
const connectDB = require('./config/dbConnection'); // Database connection
const cors = require('cors');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
