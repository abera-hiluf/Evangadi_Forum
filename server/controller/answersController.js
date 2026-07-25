const dbCon = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");
// Get answer by id
async function getAnswerById(req, res) {
  const questionId = req.params.id;
  console.log("Fetching answers for question ID:", questionId);
  try {
    const { rows: answers } = await dbCon.query(
      `SELECT 
        a.answerid, 
        a.answer, 
        u.username 
      FROM answerstable a
      JOIN userstable u ON a.userid = u.userid
      WHERE a.questionid = $1`,
      [questionId]
    );

    res.status(StatusCodes.OK).json({ answers });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

// post answer page
async function createAnswer(req, res) {
  const { answer } = req.body;
  const question_id = req.params.id;
  const userid = req.user.userid;

  console.log(userid);

  if (!answer || !question_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide answer" });
  }

  try {
    await dbCon.query(
      "INSERT INTO answerstable (answer, questionid, userid) VALUES ($1, $2, $3)",
      [answer, question_id, userid]
    );
    res.status(StatusCodes.CREATED).json({ msg: "Answer posted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
}

// update answer
async function updateAnswers(req, res) {
  const answerId = req.params.id;
  const { answer } = req.body;

  if (!answer || answer.trim() === "") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Answer content is required" });
  }

  try {
    const result = await dbCon.query(
      "UPDATE answerstable SET answer = $1 WHERE answerid = $2",
      [answer.trim(), answerId]
    );

    if (result.rowCount === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Answer not found or already updated" });
    }

    return res.status(StatusCodes.OK).json({ msg: "Answer updated!" });
  } catch (err) {
    console.error(err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to update answer",
    });
  }
}

// delete answer function
async function deleteAnswer(req, res) {
  const { id } = req.params;
  try {
    await dbCon.query("DELETE FROM answerstable WHERE answerid = $1", [id]);
    return res.status(StatusCodes.OK).json({ msg: "Answer deleted!" });
  } catch (err) {
    console.error(err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to delete Answer",
    });
  }
}

// Get single answer by answerid
async function getSingleAnswerById(req, res) {
  const answerId = req.params.id;

  try {
    const { rows } = await dbCon.query(
      "SELECT answerid, answer, questionid FROM answerstable WHERE answerid = $1",
      [answerId]
    );

    return res.status(StatusCodes.OK).json(rows[0]);
  } catch (error) {
    console.error(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to fetch answer",
    });
  }
}

module.exports = {
  getAnswerById,
  createAnswer,
  deleteAnswer,
  updateAnswers,
  getSingleAnswerById, // export the new function
};
