const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String },
    tags: { type: [String], default: [] },
    isPinned: { type: Boolean, default: false },
    userId: { type: String, required: true },
    selectedColor: { type: String, required: true },
    createdOn: { type: Date, default: Date.now() },
    reminderDate: { type: String },
    reminderTime: { type: String },
    isReminderActive: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    acceptedNotes: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('notes', schema)