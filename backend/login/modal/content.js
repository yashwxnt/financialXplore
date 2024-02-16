// content.js

const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  content: { type: String, required: true }
});

module.exports = mongoose.model('Content', contentSchema);
