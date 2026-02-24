const Audience = require('../models/Audience');
const xlsx = require('xlsx');
const { sendConfirmationEmail } = require('../utils/emailService');

// ── Register Audience (auto mark present) ─────────────────────────────
const registerAudience = async (req, res) => {
    try {
        const { role, name, email, mobile, college, branch, course, year, childName, address, designation, department } = req.body;

        if (!role || !name || !email || !mobile) {
            return res.status(400).json({ message: 'Role, name, email, and mobile are required' });
        }

        const validRoles = ['Student', 'Parents', 'Faculty'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role provided' });
        }

        if (role === 'Student' && !college) {
            return res.status(400).json({ message: 'College is required for Students' });
        }
        if (role === 'Parents' && (!childName || !address)) {
            return res.status(400).json({ message: 'Child name and address are required for Parents' });
        }
        if (role === 'Faculty' && (!designation || !department)) {
            return res.status(400).json({ message: 'Designation and department are required for Faculty' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Strict 10 digit Indian Mobile
        const mobileRegex = /^[6-9][0-9]{9}$/;
        if (!mobileRegex.test(mobile.replace(/\s/g, ''))) {
            return res.status(400).json({ message: 'Mobile must be a valid 10-digit Indian number' });
        }

        // Create new audience instance
        const newAudience = new Audience({
            name: name.trim(),
            role: role.trim(),
            email: email.trim().toLowerCase(),
            mobile: mobile.trim(),
            college: college?.trim() || '',
            branch: branch?.trim() || '',
            course: course?.trim() || '',
            year: year?.trim() || '',
            childName: childName?.trim() || '',
            address: address?.trim() || '',
            designation: designation?.trim() || '',
            department: department?.trim() || '',
            presentAt: new Date(), // Mark present automatically
        });

        await newAudience.save();

        // Send welcome email
        if (newAudience.email) {
            sendConfirmationEmail(newAudience.email, newAudience, 'audience');
            // Notify Admin
            if (process.env.ADMIN_EMAIL) {
                sendConfirmationEmail(process.env.ADMIN_EMAIL, newAudience, 'audience', true);
            }
        }

        return res.status(201).json({
            message: 'Audience registered and attendance marked',
            audience: newAudience,
        });
    } catch (err) {
        console.error('Register audience error:', err);
        return res.status(500).json({ message: 'Server error during registration' });
    }
};

// ── Get All Audience (paginated) ───────────────────────────────────────
const getAllAudience = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';

        const query = search
            ? {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { college: { $regex: search, $options: 'i' } },
                    { mobile: { $regex: search, $options: 'i' } },
                ],
            }
            : {};

        const total = await Audience.countDocuments(query);
        const audience = await Audience.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return res.status(200).json({
            audience,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error('Get all audience error:', err);
        return res.status(500).json({ message: 'Server error fetching audience' });
    }
};

// ── Export Audience to Excel ───────────────────────────────────────────
const exportAudience = async (req, res) => {
    try {
        const audience = await Audience.find().sort({ createdAt: -1 });

        const data = audience.map((a, i) => ({
            '#': i + 1,
            Role: a.role,
            Name: a.name,
            Email: a.email,
            Mobile: a.mobile,
            College: a.college || '-',
            Branch: a.branch || '-',
            Course: a.course || '-',
            Year: a.year || '-',
            'Child Name': a.childName || '-',
            Address: a.address || '-',
            Designation: a.designation || '-',
            Department: a.department || '-',
            'Registered At': a.presentAt
                ? new Date(a.presentAt).toLocaleString('en-IN')
                : '-',
        }));

        const ws = xlsx.utils.json_to_sheet(data);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Audience');

        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Disposition', 'attachment; filename="audience_data.xlsx"');
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        return res.send(buffer);
    } catch (err) {
        console.error('Export audience error:', err);
        return res.status(500).json({ message: 'Server error exporting audience data' });
    }
};

module.exports = { registerAudience, getAllAudience, exportAudience };
