require('dotenv').config();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// ── Login ──────────────────────────────────────────────────────────────
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            admin: { email: admin.email, role: admin.role },
        });
    } catch (err) {
        console.error('Admin login error:', err);
        return res.status(500).json({ message: 'Server error during login' });
    }
};

// ── Seed Admin (one-time setup, supports ?force=true to reset) ─────────
const seedAdmin = async (req, res) => {
    try {
        const force = req.query.force === 'true';
        const existing = await Admin.findOne({});

        if (existing && !force) {
            return res.status(200).json({
                message: 'Admin already exists. Use ?force=true to reset with current .env credentials.',
                email: existing.email,
            });
        }

        // Delete old admin if force-resetting
        if (existing && force) {
            await Admin.deleteMany({});
        }

        const newAdmin = new Admin({
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: 'superadmin',
        });

        const newVolunteer = new Admin({
            email: 'guptaaman8574@gmail.com',
            password: 'Aman@2005',
            role: 'volunteer',
        });

        await newAdmin.save();
        await newVolunteer.save();
        return res.status(201).json({
            message: force ? 'Admin reset and re-seeded successfully' : 'Admin seeded successfully',
            email: newAdmin.email,
        });
    } catch (err) {
        console.error('Seed admin error:', err);
        return res.status(500).json({ message: 'Server error during seeding' });
    }
};

// ── Dashboard Stats ────────────────────────────────────────────────────
const getDashboardStats = async (req, res) => {
    try {
        const RegisteredStudent = require('../models/RegisteredStudent');
        const Audience = require('../models/Audience');

        const [totalStudents, presentStudents, audienceCount] = await Promise.all([
            RegisteredStudent.countDocuments(),
            RegisteredStudent.countDocuments({ isPresent: true }),
            Audience.countDocuments(),
        ]);

        return res.status(200).json({
            totalStudents,
            presentStudents,
            absentStudents: totalStudents - presentStudents,
            audienceCount,
        });
    } catch (err) {
        console.error('Dashboard stats error:', err);
        return res.status(500).json({ message: 'Server error fetching stats' });
    }
};

module.exports = { login, seedAdmin, getDashboardStats };
