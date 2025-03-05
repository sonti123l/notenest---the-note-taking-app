const jwt = require('jsonwebtoken');
require('dotenv').config();

const fetchUser = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    console.log("Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Access Denied: No token provided or invalid format' });
    }

    // Extract token (removing 'Bearer ')
    const token = authHeader.split(' ')[1];
    console.log("Extracted Token:", token);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    // Attach user to request object
    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT Verification Error:", err.message);
    return res.status(401).json({ success: false, message: 'Invalid Token' });
  }
};

module.exports = fetchUser;
