const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    userId: { type: String },
    sentBy: { type: String, required: true },
    reciverEmail: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: String, default: 'pending' }
})

module.exports = mongoose.model('sentNotes', Schema)
