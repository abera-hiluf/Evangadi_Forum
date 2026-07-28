require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5500;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS middleware to communicate with frontend
app.use(cors());

const dbCon = require("./db/dbConfig");
const authMiddleware = require("./middleware/authMiddleware");
const createTable = require("./migrate/createTable");

// Serve static assets if client build exists
const clientBuildPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientBuildPath));

app.get("/api-status", (req, res) => {
  res.send("Welcome to the Evangadi Forum API");
});

// User routes middleware
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// Question routes middleware
const questionRoutes = require("./routes/questionRoutes");
app.use("/api/questions", authMiddleware, questionRoutes);

// Answer routes middleware
const answerRoutes = require("./routes/answerRoutes");
app.use("/api/answers", authMiddleware, answerRoutes);

// Fallback to index.html for React SPA client routes when serving from Express
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(clientBuildPath, "index.html"), (err) => {
    if (err) {
      res.send("Welcome to the Evangadi Forum API");
    }
  });
});

async function start() {
  const maxRetries = 5;
  const retryDelayMs = 3000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const client = await dbCon.connect();
      client.release();
      await createTable();
      console.log("Database connection successful");
      return;
    } catch (error) {
      console.log(`DB attempt ${attempt}/${maxRetries} failed: ${error.message}`);
      if (attempt === maxRetries) {
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
  }
}

start();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
