const express = require('express');
const router = express.Router();
const { login, seedAdmin, getDashboardStats } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/admin/login
router.post('/login', login);

// GET /api/admin/seed  (run once to create first admin)
router.get('/seed', seedAdmin);

// GET /api/admin/stats  (protected)
router.get('/stats', protect, getDashboardStats);

module.exports = router;
