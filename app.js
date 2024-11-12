require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const allowedOrigins = [
  'http://localhost:5173',  // for local development
  'https://fibohack-evently.vercel.app',
  'https://fibohack-evently.onrender.com',  // for production
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      // Allow requests with no origin (like mobile apps or curl requests)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
const indexRouter = require("./router/indexRouter");
require("./models/db").connectDatabase();
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const {generatedError} = require('./middleware/error');

const logger = require("morgan");
app.use(logger("short"));
const ErrorHandler = require("./utils/ErrorHandler");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSession({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
  })
);

app.use(cookieParser());


app.use("/api/v1", indexRouter);
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`request url not found: ${req.url}`), 404);
});
app.use(generatedError);

app.listen(8000);
