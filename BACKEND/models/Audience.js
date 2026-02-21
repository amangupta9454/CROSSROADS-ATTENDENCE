const mongoose = require('mongoose');

const audienceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
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
        college: {
            type: String,
            required: [true, 'College is required'],
            trim: true,
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
        presentAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Audience', audienceSchema);
