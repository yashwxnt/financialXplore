var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
var mongo = require('mongoose');

var app = express();
var port=4500;

app.listen(port,()=>{
  console.log(`server running at http://localhost:${port}`);
})
// MongoDB connection
mongo.connect("mongodb+srv://yashwanthjawaji:1425@cluster0.ikvjes2.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("Connected to the database"))
  .catch((err) => {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit the application on database connection error
  });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors()); // Enable CORS for all routes
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configure multer for file uploads if needed
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// In your Express server
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true"); // Add this line to allow credentials
  next();
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var courseRouter = require('./routes/Course'); // Adjust the path accordingly
var quizRouter = require('./routes/quiz'); // Adjust the path accordingly

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/courses', courseRouter);
app.use('/api/quiz', quizRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
