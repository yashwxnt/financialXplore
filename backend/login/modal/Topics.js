const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  topicName: { type: String, required: true, unique: true, maxlength: 100 },
  topicDescription: { type: String, required: true, maxlength: 500 }, 
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
  content: { type: mongoose.Schema.Types.ObjectId, ref: 'Content' } // Reference to Content model
});

module.exports = mongoose.model('Topic', topicSchema);
