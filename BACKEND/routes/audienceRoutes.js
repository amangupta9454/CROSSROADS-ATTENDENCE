const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    registerAudience,
    getAllAudience,
    exportAudience,
} = require('../controllers/audienceController');

// POST /api/audience  (public — audience registers themselves)
router.post('/', registerAudience);

// GET /api/audience  (protected — admin only)
router.get('/', protect, getAllAudience);

// GET /api/audience/export  (protected — admin only)
router.get('/export', protect, exportAudience);

module.exports = router;
