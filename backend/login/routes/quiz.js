const express = require('express');
const router = express.Router();
const Quiz = require('../modal/Quizz'); 
const Course = require('../modal/courses');
const Topic = require('../modal/Topics');
const { body, validationResult } = require('express-validator');

// Function to log errors and events
const logEvent = (message, level = 'info') => {
  // Log the message to your logging system or console
  console.log(`[${level.toUpperCase()}] ${message}`);
};

// Create a new quiz
router.post('/create', 
  [
    body('course').trim().notEmpty().withMessage('Course is required'),
    body('topic').trim().notEmpty().withMessage('Topic is required'),
    body('questions').isArray({ min: 1 }).withMessage('At least one question is required'),
    body('questions.*.questionText').trim().notEmpty().withMessage('Question text is required'),
    body('questions.*.options').isArray({ min: 2 }).withMessage('At least two options are required for each question'),
    body('questions.*.correctOptionIndex').isInt({ min: 0 }).withMessage('Correct option index must be a non-negative integer'),
    body('durationMinutes').isInt({ min: 1 }).withMessage('Duration must be a positive integer in minutes'),
    body('numQuestions').isInt({ min: 1 }).withMessage('Number of questions must be a positive integer'),
    body('totalCoins').isInt({ min: 0 }).withMessage('Total coins must be a non-negative integer'),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { course, topic, questions, durationMinutes, numQuestions, totalCoins } = req.body;

      // Check if the associated course exists
      const existingCourse = await Course.findById(course);
      if (!existingCourse) {
        return res.status(404).json({ message: 'Course not found.' });
      }

      // Check if the associated topic exists
      const existingTopic = await Topic.findById(topic);
      if (!existingTopic) {
        return res.status(404).json({ message: 'Topic not found.' });
      }

      // Create a new quiz object
      const newQuiz = new Quiz({
        course,
        topic,
        questions,
        durationMinutes,
        numQuestions,
        totalCoins
      });

      // Save the new quiz
      await newQuiz.save();

      // Log quiz creation event
      logEvent(`Quiz created successfully: ${newQuiz._id}`);

      res.status(201).json({ message: 'Quiz created successfully.', newQuiz });
    } catch (error) {
      console.error(error);
      logEvent(`Error creating quiz: ${error.message}`, 'error');
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }
);

// Retrieve quizzes for a specific course
router.post('/courseName', async (req, res) => {
  try {
    const courseName = req.body.courseName;

    const course = await Course.find({ courseName });
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    } 

    const quizzes = await Quiz.find({ courseName });
    console.log(quizzes)
    res.send(quizzes);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Retrieve quizzes for a specific topic in a course
router.post('/quizzesForTopic', async (req, res) => {
  try {
    const { courseId, topicId } = req.body;

    // Find the course and topic
    const course = await Course.findById(courseId);
    const topic = await Topic.findById(topicId);

    if (!course || !topic) {
      return res.status(404).json({ message: 'Course or Topic not found.' });
    }

    // Retrieve quizzes for the specified topic in the course
    const quizzes = await Quiz.find({ course: courseId, topic: topicId });

    res.status(200).json({ quizzes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Retrieve a specific quiz for a topic
router.get('/quizForTopic/:quizId', async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    res.status(200).json({ quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Attempting a Quiz
router.post('/attemptQuiz', async (req, res) => {
  try {
    const { userId, quizId, userAnswers } = req.body;

    // Find the quiz
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    // Check if the quiz has started
    const currentTime = Date.now();
    if (currentTime < quizStartTime || currentTime > quizEndTime) {
      return res.status(403).json({ message: 'Quiz time limit exceeded.' });
    }

    // Validate the user's answers
    const numQuestions = quiz.questions.length;
    if (userAnswers.length !== numQuestions) {
      return res.status(400).json({ message: `Expected ${numQuestions} answers, but received ${userAnswers.length}.` });
    }

    // Calculate score
    let score = 0;
    for (let i = 0; i < numQuestions; i++) {
      const correctOptionIndex = quiz.questions[i].correctOptionIndex;
      if (userAnswers[i] === correctOptionIndex) {
        score += 1;
      }
    }
  // Add a timer to the quiz route to enforce time limits
router.post('/start-quiz', async (req, res) => {
  try {
    const { quizId } = req.body;

    // Find the quiz by ID
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    // Start the timer for the quiz
    const quizStartTime = Date.now();
    const quizEndTime = quizStartTime + (quiz.durationMinutes * 60 * 1000); // Convert minutes to milliseconds

    // Return the start time and end time to the client
    res.status(200).json({ quizStartTime, quizEndTime });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

    // Save attempt results
    await Quiz.findOneAndUpdate(
      { _id: quizId, 'attempts.user': userId },
      { $set: { 'attempts.$.score': score, 'attempts.$.completed': true } },
      { new: true }
    );

    res.status(200).json({ message: 'Quiz attempted successfully.', score });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Reviewing Quiz Answers
router.get('/reviewQuiz/:quizId', async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    const userAnswers = quiz.userAnswers.filter(answer => answer.userId === req.userId);

    // Prepare review data
    const reviewData = userAnswers.map((attempt, index) => {
      const questionData = attempt.answers.map((answer, idx) => {
        const { questionText, options, correctOptionIndex } = quiz.questions[answer.questionIndex];
        const selectedOption = options[answer.selectedOptionIndex];
        const isCorrect = answer.selectedOptionIndex === correctOptionIndex;
        return {
          questionNumber: idx + 1,
          questionText,
          options,
          selectedOption,
          isCorrect,
        };
      });

      return {
        attemptNumber: index + 1,
        questions: questionData,
        score: attempt.score,
      };
    });

    res.status(200).json({ reviewData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Save quiz attempt results
router.post("/saveResults", async (req, res) => {
  try {
    const { userId, quizId, score, userAnswers } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Check if the user has already attempted the quiz
    const existingAttempt = quiz.attempts.find(attempt => attempt.user.toString() === userId);
    if (existingAttempt) {
      // Update existing attempt
      existingAttempt.score = score;
      existingAttempt.userAnswers = userAnswers;
    } else {
      // Add new attempt
      quiz.attempts.push({ user: userId, score: score, userAnswers: userAnswers });
    }

    // Validate the attempt (check for time limit)
    quiz.validateAttempt();

    await quiz.save();
    return res.status(200).json({ message: "Score saved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error occurred while storing" });
  }
});
// Update an existing quiz
router.put('/update/:quizId', async (req, res) => {
  try {
    const { quizId } = req.params;
    const updatedFields = req.body;

    // Find the quiz by ID and update its fields
    const quiz = await Quiz.findByIdAndUpdate(quizId, updatedFields, { new: true });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    res.status(200).json({ message: 'Quiz updated successfully.', quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Generate a randomized quiz
router.post('/generateRandomQuiz', async (req, res) => {
  try {
    const { courseId, topicId, difficultyLevel } = req.body;

    // Retrieve questions based on specified criteria (course, topic, difficulty level)
    const randomizedQuestions = await Quiz.aggregate([
      { $match: { course: courseId, topic: topicId } },
      { $sample: { size: 10 } } // Adjust the sample size as needed
    ]);

    if (!randomizedQuestions || randomizedQuestions.length === 0) {
      return res.status(404).json({ message: 'No questions found for the specified criteria.' });
    }

    // Create a new quiz object with randomized questions
    const newQuiz = new Quiz({
      course: courseId,
      topic: topicId,
      questions: randomizedQuestions,
      // Include other quiz details such as duration, numQuestions, etc.
    });

    // Save the new quiz
    await newQuiz.save();

    res.status(201).json({ message: 'Randomized quiz generated successfully.', newQuiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Provide feedback on a quiz
router.post('/provideFeedback/:quizId', async (req, res) => {
  try {
    const { quizId } = req.params;
    const { userId, message } = req.body;

    // Find the quiz by ID
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    // Add the feedback to the quiz
    quiz.feedback.push({ userId, message });

    // Save the updated quiz
    await quiz.save();

    res.status(200).json({ message: 'Feedback provided successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Retrieve feedback for a quiz
router.get('/getFeedback/:quizId', async (req, res) => {
  try {
    const { quizId } = req.params;

    // Find the quiz by ID and retrieve its feedback
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    const feedback = quiz.feedback;

    res.status(200).json({ feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a quiz
router.delete('/delete/:quizId', async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    await quiz.remove();

    res.status(200).json({ message: 'Quiz deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Retrieve quiz statistics
router.get('/statistics/:quizId', async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    // Calculate quiz statistics
    const numAttempts = quiz.attempts.length;
    const averageScore = numAttempts > 0 ? quiz.attempts.reduce((acc, curr) => acc + curr.score, 0) / numAttempts : 0;
    const completionRate = numAttempts > 0 ? (quiz.attempts.filter(attempt => attempt.completed).length / numAttempts) * 100 : 0;

    res.status(200).json({ numAttempts, averageScore, completionRate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Add a route to retrieve quiz analytics
router.get('/analytics/:quizId', async (req, res) => {
  try {
    const { quizId } = req.params;

    // Find the quiz by ID
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    // Calculate quiz statistics
    const numAttempts = quiz.attempts.length;
    const averageScore = numAttempts > 0 ? quiz.attempts.reduce((acc, curr) => acc + curr.score, 0) / numAttempts : 0;
    // Other analytics calculations...

    res.status(200).json({ numAttempts, averageScore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
