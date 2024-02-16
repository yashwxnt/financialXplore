const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true, unique: true, maxlength: 100 },
  courseDescription: { type: String, required: true, maxlength: 1000 },
  courseSummary: { type: String, required: true, maxlength: 500 },
  courseContent: { type: String, required: true },
  courseCreatedBy: { type: String, maxlength: 100 }, 
  courseCreatedDate: { type: Date, default: Date.now }, 
  courseImageUrl: { 
    type: String, 
    required: true, 
    validate: {
      validator: function(v) {
        // Validate URL format using regex
        return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  totalQuizzes: { type: Number, required: true, min: 0 },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
  ratings: [{ userId: String, rating: Number }], // Array of ratings
  reviews: [{ userId: String, review: String }] 
});

// Middleware to set courseCreatedBy before saving
courseSchema.pre('save', function(next) {
  if (!this.courseCreatedBy) {
    this.courseCreatedBy = this._user.username; 
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);
