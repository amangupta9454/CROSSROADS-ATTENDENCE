const RegisteredStudent = require('../models/RegisteredStudent');
const xlsx = require('xlsx');
const { sendConfirmationEmail } = require('../utils/emailService');

// ── Email & mobile validators ──────────────────────────────────────────
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[0-9]{10}$/;

// ── QR Lookup: Get Student by ID ───────────────────────────────────────
const getStudentById = async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await RegisteredStudent.findOne({ studentId: studentId.trim() });

        if (!student) {
            return res.status(404).json({ message: 'Student not found. Please check your Student ID.' });
        }

        return res.status(200).json({ student });
    } catch (err) {
        console.error('Get student error:', err);
        return res.status(500).json({ message: 'Server error fetching student' });
    }
};

// ── Mark Present ───────────────────────────────────────────────────────
const markPresent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await RegisteredStudent.findOne({ studentId: studentId.trim() });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (student.isPresent) {
            return res.status(400).json({
                message: 'Attendance already marked',
                presentAt: student.presentAt,
            });
        }

        student.isPresent = true;
        student.presentAt = new Date();
        await student.save();

        // Send confirmation email asynchronously (don't block response)
        if (student.leaderEmail) {
            sendConfirmationEmail(student.leaderEmail, student, 'student');
            // Notify Admin
            if (process.env.ADMIN_EMAIL) {
                sendConfirmationEmail(process.env.ADMIN_EMAIL, student, 'student', true);
            }
        }

        return res.status(200).json({
            message: 'Attendance marked successfully',
            student,
        });
    } catch (err) {
        console.error('Mark present error:', err);
        return res.status(500).json({ message: 'Server error marking attendance' });
    }
};

// ── Get All Students (paginated + search + filter) ─────────────────────
const getAllStudents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';
        const filterPresent = req.query.present;
        const eventFilter = req.query.event || '';

        let query = {};
        if (search) {
            query.$or = [
                { studentId: { $regex: search, $options: 'i' } },
                { teamName: { $regex: search, $options: 'i' } },
                { teamLeaderName: { $regex: search, $options: 'i' } },
                { college: { $regex: search, $options: 'i' } },
                { eventName: { $regex: search, $options: 'i' } },
            ];
        }
        if (filterPresent === 'true') query.isPresent = true;
        if (filterPresent === 'false') query.isPresent = false;
        if (eventFilter) query.eventName = { $regex: eventFilter, $options: 'i' };

        const total = await RegisteredStudent.countDocuments(query);
        const students = await RegisteredStudent.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return res.status(200).json({
            students,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error('Get all students error:', err);
        return res.status(500).json({ message: 'Server error fetching students' });
    }
};

// ── Get Present Students ───────────────────────────────────────────────
const getPresentStudents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';

        let query = { isPresent: true };
        if (search) {
            query.$or = [
                { studentId: { $regex: search, $options: 'i' } },
                { teamName: { $regex: search, $options: 'i' } },
                { teamLeaderName: { $regex: search, $options: 'i' } },
                { college: { $regex: search, $options: 'i' } },
            ];
        }

        const total = await RegisteredStudent.countDocuments(query);
        const students = await RegisteredStudent.find(query)
            .sort({ presentAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return res.status(200).json({
            students,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error('Get present students error:', err);
        return res.status(500).json({ message: 'Server error fetching present students' });
    }
};

// ── Validate & Build Student Object ───────────────────────────────────
function validateStudentData(data) {
    const errors = [];
    if (!data.studentId) errors.push('student_id is required');
    if (!data.teamName) errors.push('team_name is required');
    if (!data.teamLeaderName) errors.push('team_leader_name is required');
    if (!data.leaderEmail) errors.push('leader_email is required');
    else if (!emailRegex.test(data.leaderEmail)) errors.push('leader_email is invalid');
    if (!data.leaderMobile) errors.push('leader_mobile is required');
    else if (!mobileRegex.test(String(data.leaderMobile).replace(/\s/g, '')))
        errors.push('leader_mobile must be a 10-digit number');
    if (!data.college) errors.push('college is required');
    if (!data.branch) errors.push('branch is required');
    if (!data.year) errors.push('year is required');
    if (!data.eventName) errors.push('event_name is required');
    if (!data.teamSize) errors.push('team_size is required');
    return errors;
}

// ── Add Single Student ─────────────────────────────────────────────────
const addStudent = async (req, res) => {
    try {
        const {
            studentId, teamName, teamLeaderName, leaderEmail, leaderMobile,
            college, branch, year, eventName, teamSize, teamMembers,
        } = req.body;

        const errors = validateStudentData({
            studentId, teamName, teamLeaderName, leaderEmail, leaderMobile,
            college, branch, year, eventName, teamSize,
        });
        if (errors.length) return res.status(400).json({ message: errors.join(', ') });

        const existing = await RegisteredStudent.findOne({ studentId: studentId.trim() });
        if (existing) {
            return res.status(409).json({ message: `Student ID "${studentId}" already exists` });
        }

        const members = Array.isArray(teamMembers)
            ? teamMembers.filter((m) => m && m.trim())
            : [];

        const student = new RegisteredStudent({
            studentId: studentId.trim(),
            teamName: teamName.trim(),
            teamLeaderName: teamLeaderName.trim(),
            leaderEmail: leaderEmail.trim().toLowerCase(),
            leaderMobile: String(leaderMobile).trim(),
            college: college.trim(),
            branch: branch.trim(),
            year: String(year).trim(),
            eventName: eventName.trim(),
            teamSize: Number(teamSize),
            teamMembers: members,
        });

        await student.save();
        return res.status(201).json({ message: 'Student added successfully', student });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Student ID already exists' });
        }
        console.error('Add student error:', err);
        return res.status(500).json({ message: 'Server error adding student' });
    }
};

// ── Bulk Upload (Excel) ────────────────────────────────────────────────
const bulkUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });

        if (rows.length === 0) {
            return res.status(400).json({ message: 'Excel file is empty' });
        }

        // Check required columns
        const requiredColumns = [
            'student_id', 'team_name', 'team_leader_name', 'leader_email',
            'leader_mobile', 'college', 'branch', 'year', 'event_name', 'team_size',
        ];
        const firstRow = rows[0];
        const missingCols = requiredColumns.filter((col) => !(col in firstRow));
        if (missingCols.length > 0) {
            return res.status(400).json({
                message: `Missing required columns: ${missingCols.join(', ')}`,
            });
        }

        const toInsert = [];
        const errors = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowNum = i + 2; // 1-indexed + header row

            const data = {
                studentId: String(row.student_id || '').trim(),
                teamName: String(row.team_name || '').trim(),
                teamLeaderName: String(row.team_leader_name || '').trim(),
                leaderEmail: String(row.leader_email || '').trim().toLowerCase(),
                leaderMobile: String(row.leader_mobile || '').trim(),
                college: String(row.college || '').trim(),
                branch: String(row.branch || '').trim(),
                year: String(row.year || '').trim(),
                eventName: String(row.event_name || '').trim(),
                teamSize: Number(row.team_size) || 0,
            };

            const validationErrors = validateStudentData(data);
            if (validationErrors.length) {
                errors.push({ row: rowNum, studentId: data.studentId, errors: validationErrors });
                continue;
            }

            // Collect team members
            const members = [];
            for (let m = 1; m <= 8; m++) {
                const val = String(row[`team_member_name_${m}`] || '').trim();
                if (val) members.push(val);
            }

            toInsert.push({ ...data, teamMembers: members });
        }

        // Bulk insert with duplicate skip
        let inserted = 0;
        let duplicates = 0;

        if (toInsert.length > 0) {
            try {
                const result = await RegisteredStudent.insertMany(toInsert, { ordered: false });
                inserted = result.length;
            } catch (bulkErr) {
                if (bulkErr.writeErrors) {
                    inserted = toInsert.length - bulkErr.writeErrors.length;
                    duplicates = bulkErr.writeErrors.length;
                    bulkErr.writeErrors.forEach((e) => {
                        errors.push({
                            row: '?',
                            studentId: e.err?.op?.studentId || 'unknown',
                            errors: ['Duplicate student_id — skipped'],
                        });
                    });
                } else {
                    throw bulkErr;
                }
            }
        }

        return res.status(200).json({
            message: 'Bulk upload complete',
            totalProcessed: rows.length,
            inserted,
            duplicatesSkipped: duplicates,
            failedRows: errors.length - duplicates,
            errors,
        });
    } catch (err) {
        console.error('Bulk upload error:', err);
        return res.status(500).json({ message: 'Server error during bulk upload' });
    }
};

// ── Export All Students to Excel ───────────────────────────────────────
const exportStudents = async (req, res) => {
    try {
        const students = await RegisteredStudent.find().sort({ createdAt: -1 });
        const data = buildExportData(students);

        const ws = xlsx.utils.json_to_sheet(data);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'All Students');
        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Disposition', 'attachment; filename="all_students.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        return res.send(buffer);
    } catch (err) {
        console.error('Export students error:', err);
        return res.status(500).json({ message: 'Server error exporting students' });
    }
};

// ── Export Present Students to Excel ──────────────────────────────────
const exportPresentStudents = async (req, res) => {
    try {
        const students = await RegisteredStudent.find({ isPresent: true }).sort({ presentAt: -1 });
        const data = buildExportData(students);

        const ws = xlsx.utils.json_to_sheet(data);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Present Students');
        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Disposition', 'attachment; filename="present_students.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        return res.send(buffer);
    } catch (err) {
        console.error('Export present students error:', err);
        return res.status(500).json({ message: 'Server error exporting present students' });
    }
};

// ── Helper: Build Export Array ─────────────────────────────────────────
function buildExportData(students) {
    return students.map((s, i) => ({
        '#': i + 1,
        'Student ID': s.studentId,
        'Team Name': s.teamName,
        'Team Leader': s.teamLeaderName,
        'Leader Email': s.leaderEmail,
        'Leader Mobile': s.leaderMobile,
        College: s.college,
        Branch: s.branch,
        Year: s.year,
        'Event Name': s.eventName,
        'Team Size': s.teamSize,
        'Team Members': s.teamMembers.join(', '),
        Status: s.isPresent ? 'Present' : 'Absent',
        'Present At': s.presentAt ? new Date(s.presentAt).toLocaleString('en-IN') : '-',
    }));
}

module.exports = {
    getStudentById,
    markPresent,
    getAllStudents,
    getPresentStudents,
    addStudent,
    bulkUpload,
    exportStudents,
    exportPresentStudents,
};