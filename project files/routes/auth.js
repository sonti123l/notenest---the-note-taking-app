const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;

      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ email, password: hashedPassword });
      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ success: true, token });

    } catch (err) {
      next(err); // Pass error to the errorHandler middleware
    }
  }
);

module.exports = router;
