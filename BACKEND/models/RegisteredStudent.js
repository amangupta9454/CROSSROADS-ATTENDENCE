const mongoose = require('mongoose');

const registeredStudentSchema = new mongoose.Schema(
    {
        studentId: {
            type: String,
            required: [true, 'Student ID is required'],
            unique: true,
            trim: true,
        },
        teamName: {
            type: String,
            required: [true, 'Team name is required'],
            trim: true,
        },
        teamLeaderName: {
            type: String,
            required: [true, 'Team leader name is required'],
            trim: true,
        },
        leaderEmail: {
            type: String,
            required: [true, 'Leader email is required'],
            trim: true,
            lowercase: true,
        },
        leaderMobile: {
            type: String,
            required: [true, 'Leader mobile is required'],
            trim: true,
        },
        college: {
            type: String,
            required: [true, 'College is required'],
            trim: true,
        },
        branch: {
            type: String,
            required: [true, 'Branch is required'],
            trim: true,
        },
        year: {
            type: String,
            required: [true, 'Year is required'],
            trim: true,
        },
        eventName: {
            type: String,
            required: [true, 'Event name is required'],
            trim: true,
        },
        teamSize: {
            type: Number,
            required: [true, 'Team size is required'],
            min: 1,
            max: 8,
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
    },
    { timestamps: true }
);

module.exports = mongoose.model('RegisteredStudent', registeredStudentSchema);