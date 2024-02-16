const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Reference to Course model
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true }, // Reference to Topic model
  questions: [{
    questionText: { type: String, required: true, maxlength: 500 },
    options: [{ type: String, required: true, maxlength: 100 }],
    correctOptionIndex: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function(v) {
          return v < this.options.length;
        },
        message: props => `Correct option index ${props.value} is invalid!`
      }
    },
    coinsPerCorrectAnswer: { type: Number, default: 1 },
  }],
  durationMinutes: { type: Number, default: 15, min: 1 },
  numQuestions: { type: Number, required: true, min: 1 },
  totalCoins: { type: Number, default: 10, min: 0 },
  feedback: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, message: String }],
  attempts: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number },
    completed: { type: Boolean, default: false },
    elapsedTimeMinutes: { type: Number, default: 0 },
    attemptStartTime: { type: Date }, // Timestamp when the attempt started
  }],
  userAnswers: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    answers: [{
        questionIndex: { type: Number, required: true },
        selectedOptionIndex: { type: Number },
        isCorrect: { type: Boolean },
        explanation: { type: String }
    }],
    randomizeQuestions: { type: Boolean, default: false },
    randomizeOptions: { type: Boolean, default: false },
    attemptStartTime: { type: Date },
    timeLimitMinutes: { type: Number, default: 15, min: 1 },
  }],
});

// Calculate the earned coins based on correct answers
quizSchema.methods.calculateEarnedCoins = function(attemptedQuestions) {
  let earnedCoins = 0;
  for (const [index, question] of this.questions.entries()) {
    if (attemptedQuestions[index] === question.correctOptionIndex) {
      earnedCoins += question.coinsPerCorrectAnswer;
    }
  }
  return earnedCoins;
};

// Calculate the badge based on earned coins
quizSchema.methods.calculateBadge = function(earnedCoins) {
  if (earnedCoins >= 50) {
    return 'Golden Badge';
  } else if (earnedCoins >= 30) {
    return 'Silver Badge';
  } else if (earnedCoins >= 10) {
    return 'Bronze Badge';
  } else {
    return 'No Badge';
  }
};

// Function to validate quiz attempt time limit and completion
quizSchema.methods.validateAttempt = function() {
  const now = new Date();
  for (const attempt of this.attempts) {
    const elapsedTime = (now - attempt.attemptStartTime) / (1000 * 60); // Convert milliseconds to minutes
    if (elapsedTime >= this.durationMinutes) {
      attempt.completed = true;
    }
  }
};

module.exports = mongoose.model('Quiz', quizSchema);
