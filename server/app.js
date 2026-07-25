require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const port = 5500;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cors middleware to cumminucate with frontend
app.use(cors());
const dbCon = require("./db/dbConfig");
//auth middleware
const authMiddleware = require("./middleware/authMiddleware");
const createTable = require("./migrate/createTable");

app.get("/", (req, res) => {
  res.send("Welcome to the Evangadi Forum API");
  console.log("request received at root endpoint");
});

//user routes middleware
const userRoutes = require("./routes/userRoutes");

//user routes middleware
app.use("/api/users", userRoutes);

//question routes middleware
const questionRoutes = require("./routes/questionRoutes");
app.use("/api/questions", authMiddleware, questionRoutes);
// answer routes middleware
const answerRoutes = require("./routes/answerRoutes");
app.use("/api/answers", authMiddleware, answerRoutes);

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
  console.log(`Server is running on http://localhost:${port}`);
});
