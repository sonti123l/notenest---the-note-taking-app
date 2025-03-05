const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const fetchuser = (req, res, next) => {
  const token = req.header('auth-token'); // Get token from request header

  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  try {
    // Verify token and extract user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Attach user info to request object
    next(); // Proceed to next middleware or route
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = fetchuser;
