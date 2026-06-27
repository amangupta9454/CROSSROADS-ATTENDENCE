const mongoose = require('mongoose');

const registeredStudentSchema = new mongoose.Schema(
    {
        studentId: {
            type: String,
            required: [true, 'Student ID is required'],
            unique: true,
            trim: true,
        },
        teamId: {
            type: String,
            required: [true, 'Team ID is required'],
            trim: true,
        },
        teamName: {
            type: String,
            required: [true, 'Team name is required'],
            trim: true,
        },
        theme: {
            type: String,
            trim: true,
        },
        name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        role: {
            type: String,
            enum: ['Leader', 'Member'],
            default: 'Member',
        },
        // Old fields made optional
        teamLeaderName: {
            type: String,
            trim: true,
        },
        leaderEmail: {
            type: String,
            trim: true,
            lowercase: true,
        },
        leaderMobile: {
            type: String,
            trim: true,
        },
        college: {
            type: String,
            trim: true,
        },
        branch: {
            type: String,
            trim: true,
        },
        year: {
            type: String,
            trim: true,
        },
        eventName: {
            type: String,
            trim: true,
        },
        teamSize: {
            type: Number,
            required: [true, 'Team size is required'],
            min: 1,
            max: 20,
        },
        teamMembers: {
            type: [String],
            default: [],
        },
        isPresent: {
            type: Boolean,
            default: false,
        },
        presentAt: {
            type: Date,
            default: null,
        },
        attendanceMarkedAt: {
            type: Date,
            default: null,
        },
        isLocked: {
            type: Boolean,
            default: false,
        },
        emailedAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('RegisteredStudent', registeredStudentSchema);