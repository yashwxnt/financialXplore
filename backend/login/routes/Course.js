const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Course = require('../modal/courses'); 
const Topic = require('../modal/Topics');
const Content = require('../modal/content');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

// Function to log errors and events
const logEvent = (message, level = 'info') => {
  // Log the message to your logging system or console
  console.log(`[${level.toUpperCase()}] ${message}`);
};

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('File type not supported. Please upload an image or a PDF file.'), false);
    }
  },
});

// POST route to upload PDF and create a new course
router.post('/uploadpdf', 
  upload.single('coursePdf'), 
  [
    body('courseName').trim().notEmpty().withMessage('Course name is required'),
    body('courseDescription').trim().notEmpty().withMessage('Course description is required'),
    body('topics.*.topicName').trim().notEmpty().withMessage('Topic name is required'), // Validate topic name for each topic
    body('courseCreatedBy').trim().notEmpty().withMessage('Course creator is required'),
    body('courseImageUrl').isURL().withMessage('Invalid image URL'),
    body('totalQuizzes').isInt({ min: 0 }).withMessage('Total quizzes must be a positive integer'),
  ],
  async (req, res) => {
    try {
      // Check if file is attached
      if (!req.file) {
        return res.status(400).json({ message: 'No file attached.' });
      }

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { courseName, courseDescription, topics, courseCreatedBy, courseImageUrl, totalQuizzes } = req.body;

      // Array to store topic documents
      const topicDocuments = [];

      // Iterate through each topic
      for (const topic of topics) {
        const topicPdf = req.files && req.files[`topicPdf_${topic.topicName}`] ? req.files[`topicPdf_${topic.topicName}`][0].buffer : null;

        // Check if topic PDF is missing
        if (!topicPdf) {
          return res.status(400).json({ message: `PDF file missing for topic ${topic.topicName}` });
        }

        // Extract content from PDF
        const pdfData = await pdfParse(topicPdf);
        const content = pdfData.text;

        // Create new content document for the topic
        const newContent = new Content({
          topic: topic._id, // Ensure you're sending topic IDs from the frontend
          content: content
        });

        // Save content document
        await newContent.save();

        // Push the topic document to the array
        topicDocuments.push({
          topicName: topic.topicName,
          contentId: newContent._id // Store the content document ID
        });
      }

      // Create a new course object
      const newCourse = new Course({
        _id: uuidv4(),
        courseName,
        courseDescription,
        courseSummary: '', // Add summary functionality if needed
        courseCreatedBy,
        courseCreatedDate: new Date(),
        courseImageUrl,
        totalQuizzes,
        topics: topicDocuments.map(topic => ({
          topicName: topic.topicName,
          contentId: topic.contentId
        }))
      });

      // Save the new course
      await newCourse.save();

      // Log course creation event
      logEvent(`Course created successfully: ${newCourse._id}`);

      res.status(201).json({ message: 'Course created successfully.', newCourse });
    } catch (error) {
      console.error(error);
      logEvent(`Error creating course: ${error.message}`, 'error');
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }
);

// Update a specific course by _id
router.put('/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { courseName, courseDescription, courseImageUrl, totalQuizzes, topics } = req.body;

    // Check if the course exists
    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Update course fields
    existingCourse.courseName = courseName;
    existingCourse.courseDescription = courseDescription;
    existingCourse.courseImageUrl = courseImageUrl;
    existingCourse.totalQuizzes = totalQuizzes;

    // Update topics if any
    if (topics && topics.length > 0) {
      const updatedTopics = [];

      for (const topic of topics) {
        const existingTopic = await Topic.findById(topic._id);

        if (existingTopic) {
          existingTopic.topicName = topic.topicName;
          existingTopic.topicDescription = topic.topicDescription;
          await existingTopic.save();
          updatedTopics.push(existingTopic._id);
        }
      }

      existingCourse.topics = updatedTopics;
    }

    const updatedCourse = await existingCourse.save();

    // Log course update event
    logEvent(`Course updated successfully: ${courseId}`);

    res.status(200).json({ message: 'Course updated successfully.', updatedCourse });
  } catch (error) {
    console.error(error);
    logEvent(`Error updating course: ${error.message}`, 'error');
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.post('/rate-course', async (req, res) => {
  const { courseId, userId, rating } = req.body;

  try {
    // Find course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user has already rated the course
    const existingRating = course.ratings.find(item => item.userId === userId);
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
    } else {
      // Add new rating
      course.ratings.push({ userId, rating });
    }

    // Save updated course
    await course.save();

    res.status(200).json({ message: 'Course rated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Add a route to handle course reviews and comments
router.post('/reviews', async (req, res) => {
  try {
    const { courseId, userId, review, rating } = req.body;

    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Add the review and rating to the course
    course.reviews.push({ userId, review, rating });

    // Calculate the new average rating for the course
    const totalRatings = course.reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = totalRatings / course.reviews.length;
    course.averageRating = averageRating;

    // Save the updated course
    await course.save();

    res.status(200).json({ message: 'Review added successfully.', averageRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a specific course by _id
router.delete('/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if the course exists
    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const deletedCourse = await Course.findByIdAndDelete(courseId);

    // Log course deletion event
    logEvent(`Course deleted successfully: ${courseId}`);

    res.status(200).json({ message: 'Course deleted successfully.', deletedCourse });
  } catch (error) {
    console.error(error);
    logEvent(`Error deleting course: ${error.message}`, 'error');
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
