const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

// Import the User model
const User = require('../modal/user');

// Import the Course model
const Course = require('../modal/courses');
const Quiz = require('../modal/Quizz');

// Email verification middleware
async function sendVerificationEmail(email, verificationToken) {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password'
            }
        });

        let info = await transporter.sendMail({
            from: '"Your Application" <your-email@gmail.com>',
            to: email,
            subject: 'Email Verification',
            html: `
              <h1>Email Verification</h1>
              <p>Click <a href="http://your-app.com/verify/${verificationToken}">here</a> to verify your email address.</p>
          `
        });

        console.log('Verification email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error; // Propagate the error to the caller
    }
}

// Input validation middleware
function validateInput(req, res, next) {
    const { userName, email, phone } = req.body;
    if (!userName || !email || !phone) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }
    next();
}

// Logging middleware
function logRequest(req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
}

// Authorization middleware
async function requireAdmin(req, res, next) {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access forbidden.' });
        }
        next();
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
}

// Error handling middleware
function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
}

// User registration
router.post("/register", validateInput, async (req, res, next) => {
    try {
        const { userName, password, email, phone } = req.body;

        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists in the database" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationToken = generateVerificationToken();

        const newUser = new User({
            userName,
            password: hashedPassword,
            email,
            phone,
            verificationToken
        });

        await newUser.save();
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: "User registered successfully. Verification email sent." });
    } catch (error) {
        console.error('Error registering user:', error);
        next(error); // Pass the error to the error handling middleware
    }
});
router.post('/uploadProfilePicture/:userId', upload.single('profilePicture'), async (req, res) => {
  try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      if (!req.file) {
          return res.status(400).json({ message: 'Profile picture is missing.' });
      }

      const uploadedFile = req.file;

      user.profilePicture = uploadedFile.path;

      await user.save();

      res.status(200).json({ message: 'Profile picture uploaded successfully.' });
  } catch (error) {
      console.error('Error uploading profile picture:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Wrong username or password" });
    }

    // If authentication successful, return user details
    res.status(200).json({
      userId: user._id,
      userName: user.userName,
      role: user.role,
      score: user.score
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// Add a route for password reset
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Generate a unique token for password reset
    const token = crypto.randomBytes(20).toString('hex');
    
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Set the token and expiry time for password reset
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

    // Save the user with the updated token and expiry time
    await user.save();

    // Send an email with a password reset link containing the token
    const resetLink = `http://yourdomain.com/reset-password/${token}`; // Replace with your domain
    const mailOptions = {
      to: email,
      subject: 'Password Reset Request',
      html: `You are receiving this email because you (or someone else) have requested to reset your password.<br><br>Please click on the following link to reset your password:<br><br><a href="${resetLink}">${resetLink}</a><br><br>If you did not request this, please ignore this email and your password will remain unchanged.`,
    };

    // Send the email using your email service provider (e.g., nodemailer)
    // Example using nodemailer:
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset instructions sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Enroll user in a course
router.post('/enroll', async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Enroll user in the course
    user.registeredCourses.push(courseId);
    await user.save();

    res.status(200).json({ message: 'Enrolled in the course successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Submit feedback for a course
router.post('/feedback', async (req, res) => {
  try {
    const { userId, courseId, feedbackMessage, rating } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Add feedback to the course
    course.feedback.push({ target: userId, feedbackMessage, rating });
    await course.save();

    res.status(200).json({ message: 'Feedback submitted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get user's performance
router.get('/performance/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Retrieve user's enrolled courses and quizzes
    const user = await User.findById(userId)
      .populate('registeredCourses', 'courseName')
      .populate('quizPerformances.quiz', 'courseName totalCoins');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.post('/user-progress', async (req, res) => {
  const { userId, courseId, progress } = req.body;

  try {
    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update or add course progress
    const existingProgressIndex = user.courseProgress.findIndex(item => item.courseId === courseId);
    if (existingProgressIndex !== -1) {
      // Update existing progress
      user.courseProgress[existingProgressIndex].progress = progress;
    } else {
      // Add new progress
      user.courseProgress.push({ courseId, progress });
    }

    // Save updated user
    await user.save();

    res.status(200).json({ message: 'User progress updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Get current user details
router.get('/getCurrentUser/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get user's enrolled courses
router.get('/getUserEnrolledCourses/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('registeredCourses', 'name');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Update user profile endpoint
router.put('/updateProfile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { userName, email, phone } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update user profile
    if (userName) user.userName = userName;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();
    res.status(200).json({ message: 'User profile updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Change password endpoint
router.put('/changePassword/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the old password matches
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Old password is incorrect.' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Delete account endpoint
router.delete('/deleteAccount/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete the user
    await User.findByIdAndDelete(userId);
    
    res.status(200).json({ message: 'Account deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Input validation middleware
function validateInput(req, res, next) {
  const { userName, email, phone } = req.body;
  if (!userName || !email || !phone) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  next();
}

// Apply input validation middleware to relevant routes
router.post('/register', validateInput, async (req, res) => { /* register route logic */ });
router.put('/updateProfile/:userId', validateInput, async (req, res) => { /* updateProfile route logic */ });
// Add validation to other routes as needed
// Logging middleware
function logRequest(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

// Apply logging middleware to all routes
router.use(logRequest);
// Authorization middleware
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access forbidden.' });
  }
  next();
}

// Apply authorization middleware to relevant routes
router.post('/createCourse', requireAdmin, async (req, res) => { /* createCourse route logic */ });
// Add authorization to other routes as needed
// Error handling middleware
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
}

// Apply error handling middleware
router.use(errorHandler);
router.use(logRequest);
module.exports = router;
