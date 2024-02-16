const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    userName: { 
        type: String, 
        required: true, 
        unique: true, 
        maxlength: 50,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9_]+$/.test(v); // Validate alphanumeric characters and underscores
            },
            message: props => `${props.value} is not a valid username!`
        }
    },
    password: { 
        type: String, 
        required: true, 
        minlength: 8 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: function(v) {
                return /\S+@\S+\.\S+/.test(v); // Validate email format using regex
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    phone: { 
        type: String, 
        validate: {
            validator: function(v) {
                return /^[0-9]{10}$/.test(v); // Validate phone number format using regex
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    registeredCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    totalCoinsEarned: { type: Number, default: 0 },
    badges: String,
    quizPerformances: [{
        quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
        coinsEarned: { type: Number, default: 0 },
    }],
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    feedback: [{
        target: { type: mongoose.Schema.Types.ObjectId, refPath: 'feedbackTargetType' },
        feedbackTargetType: { type: String, enum: ['Course', 'Quiz'] },
        feedbackMessage: String,
        rating: { type: Number, min: 1, max: 5 } // Rating scale from 1 to 5
    }],
    profilePicture: { data: Buffer, contentType: String }, // Modified to store buffer data and content type
    quizStatistics: [{
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
        attempts: { type: Number, default: 0 },
        averageScore: { type: Number, default: 0 },
        completionRate: { type: Number, default: 0 },
        improvement: { type: Number, default: 0 } // Track improvement over time (e.g., last attempt score - first attempt score)
    }],
    courseProgress: [{ courseId: String, progress: Number }] 
    
});

// Middleware to hash the password before saving
userSchema.pre('save', async function(next) {
    try {
        if (this.isModified('password')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords for authentication
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
