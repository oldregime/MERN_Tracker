const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Placeholder route
router.get('/', protect, (req, res) => {
  res.json({ message: 'Budget routes working' });
});

module.exports = router;