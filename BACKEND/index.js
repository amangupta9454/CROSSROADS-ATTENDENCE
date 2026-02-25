// index.js — Main entry point (Vercel serverless + local Node.js)
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const audienceRoutes = require('./routes/audienceRoutes');

// ── Cached DB connection (Vercel serverless optimized) ─────────────────
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) return cachedDb;

    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
            minPoolSize: 2,
            socketTimeoutMS: 20000,
            family: 4,
        });
        cachedDb = db;
        console.log('✅ MongoDB connected (cached)');
        return db;
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        throw err;
    }
}

const app = express();

// ── Security Middleware ────────────────────────────────────────────────
app.use(helmet());

// ── CORS ───────────────────────────────────────────────────────────────
app.use(cors("*"))

// ── Rate Limiting ──────────────────────────────────────────────────────
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later' },
});
app.use(limiter);

// ── Body Parsers ───────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Lazy DB connection per request ─────────────────────────────────────
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (err) {
        console.error('DB connection failed:', err.message);
        return res.status(503).json({
            message: 'Database unavailable — please try again later',
        });
    }
});

// ── Routes ─────────────────────────────────────────────────────────────
app.use('/api/admin', adminRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/audience', audienceRoutes);

// ── Health check ───────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'TechFest Attendance API is running 🎉',
        timestamp: new Date().toISOString(),
    });
});

// ── 404 Handler ────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

// ── Global Error Handler ───────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
    });
});

// ── Local Development Server ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
}

// Export for Vercel
module.exports = app;