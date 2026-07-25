const { StatusCodes } = require("http-status-codes");
const dbCon = require("../db/dbConfig");
const { v4: uuidv4 } = require("uuid");

//get all question
async function allQuestions(req, res) {
  try {
    const { rows: questions } = await dbCon.query(`
      SELECT 
        q.questionid AS question_id,
        q.title,
        q.description AS content,
        q.created_at,
        u.username AS user_name,
        COUNT(a.answerid)::int AS "answerCount"
      FROM questionstable q
      JOIN userstable u ON q.userid = u.userid
      LEFT JOIN answerstable a ON q.questionid = a.questionid
      GROUP BY q.questionid, q.title, q.description, q.created_at, u.username
      ORDER BY q.created_at DESC
    `);
    return res.status(StatusCodes.OK).json({ questions });
  } catch (err) {
    console.log(err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error fetching questions",
    });
  }
}

// Get question by id
async function getQuestionById(req, res) {
  const questionid = req.params.id;
  console.log(questionid);

  if (!questionid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "No question ID provided" });
  }

  try {
    const { rows } = await dbCon.query(
      "SELECT q.questionid, q.title, q.description, u.username FROM questionstable q JOIN userstable u ON q.userid = u.userid WHERE q.questionid=$1",
      [questionid]
    );

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "The requested question could not be found",
      });
    }
    return res.status(StatusCodes.OK).json({ rows });
  } catch (error) {
    console.error("Database error:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "An unexpected error occurred",
    });
  }
}

// Create a new question
async function createQuestion(req, res) {
  const { title, description, tag } = req.body;
  if (!title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "All fields are required",
    });
  }
  try {
    const questionid = uuidv4(); // Generate a unique question ID
    const userid = req.user.userid; // Get the user ID from the authenticated user

    const insertQuery = `INSERT INTO questionstable (questionid, userid, title, description, tag) VALUES ($1, $2, $3, $4, $5)`;
    await dbCon.query(insertQuery, [
      questionid,
      userid,
      title,
      description,
      tag || null,
    ]);

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Question created successfully" });
  } catch (error) {
    console.error("Error creating question:", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "An unexpected error occurred.",
    });
  }
}

// PUT /update/question/:id
async function updateQuestion(req, res) {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    await dbCon.query(
      "UPDATE questionstable SET title = $1, description = $2 WHERE questionid = $3",
      [title, description, id]
    );
    return res.status(StatusCodes.OK).json({ msg: "Question updated!" });
  } catch (err) {
    console.error(err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to update question",
    });
  }
}

// delete question function
async function deleteQuestion(req, res) {
  const { id } = req.params;
  try {
    await dbCon.query("DELETE FROM answerstable WHERE questionid = $1", [id]);
    await dbCon.query("DELETE FROM questionstable WHERE questionid = $1", [id]);
    return res.status(StatusCodes.OK).json({ msg: "Question deleted!" });
  } catch (err) {
    console.error(err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to delete question",
    });
  }
}
module.exports = {
  allQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
