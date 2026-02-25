const mongoose = require('mongoose');

const audienceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            enum: ['Student', 'Parents', 'Faculty'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
        },
        mobile: {
            type: String,
            required: [true, 'Mobile is required'],
            trim: true,
        },
        // Student Fields
        college: {
            type: String,
            trim: true,
            default: '',
        },
        branch: {
            type: String,
            trim: true,
            default: '',
        },
        course: {
            type: String,
            trim: true,
            default: '',
        },
        year: {
            type: String,
            trim: true,
            default: '',
        },
        // Parents Fields
        childName: {
            type: String,
            trim: true,
            default: '',
        },
        address: {
            type: String,
            trim: true,
            default: '',
        },
        // Faculty Fields
        designation: {
            type: String,
            trim: true,
            default: '',
        },
        department: {
            type: String,
            trim: true,
            default: '',
        },
        presentAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Audience', audienceSchema);