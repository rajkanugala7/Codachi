const express = require('express');
const { loginUser, verifyToken } = require('../controllers/LoginControllers') // Adjust the path according to your structure

const router = express.Router();

// Login route
router.post('/login', loginUser);

// Protected route example (you can add more routes as needed)
router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Welcome to the protected route!', user: req.user });
});

module.exports = router;
