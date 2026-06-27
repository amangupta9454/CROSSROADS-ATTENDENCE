const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const {
    getStudentById,
    markPresent,
    getAllStudents,
    getPresentStudents,
    addStudent,
    bulkUpload,
    exportStudents,
    exportPresentStudents,
    getStudentsByTeamId,
    markTeamAttendance,
} = require('../controllers/studentController');

// Multer — in-memory storage for Excel file
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.mimetype === 'application/vnd.ms-excel' ||
            file.mimetype === 'text/csv' ||
            file.originalname.endsWith('.xlsx') ||
            file.originalname.endsWith('.xls') ||
            file.originalname.endsWith('.csv')
        ) {
            cb(null, true);
        } else {
            cb(new Error('Only .xlsx, .xls, or .csv files are allowed'));
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ── Protected (Admin only) ─────────────────────────────────────────────
router.get('/filter/present', protect, getPresentStudents);
router.get('/export/all', protect, exportStudents);
router.get('/export/present', protect, exportPresentStudents);

// ── Protected (Other Admin) ───────────────────────────────────────────
// GET /api/students  (all students — paginated)
router.get('/', protect, getAllStudents);

// POST /api/students  (add single student)
router.post('/', protect, addStudent);

// POST /api/students/bulk-upload
router.post('/bulk-upload', protect, upload.single('file'), bulkUpload);

// ── Public (QR scan flow — /id/ prefix to avoid conflicts) ────────────
// GET /api/students/id/:studentId(*) 
router.get('/id/:studentId(*)', getStudentById);

// PATCH /api/students/id/:studentId(*)/present
router.patch('/id/:studentId(*)/present', markPresent);

// ── Team Attendance Flow (Volunteer / Admin) ──────────────────────────────
router.get('/team/:teamId(*)', protect, getStudentsByTeamId);
router.patch('/team/:teamId(*)/attendance', protect, markTeamAttendance);

module.exports = router;
