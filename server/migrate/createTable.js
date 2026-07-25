const dbCon = require("../db/dbConfig");

module.exports = async function createTable() {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS userstable (
      userid SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      firstname VARCHAR(255) NOT NULL,
      lastname VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    );
  `;

  const createQuestionsTable = `
    CREATE TABLE IF NOT EXISTS questionstable (
      questionid VARCHAR(255) PRIMARY KEY,
      userid INT NOT NULL REFERENCES userstable(userid) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      tag VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createAnswersTable = `
    CREATE TABLE IF NOT EXISTS answerstable (
      answerid SERIAL PRIMARY KEY,
      questionid VARCHAR(255) NOT NULL REFERENCES questionstable(questionid) ON DELETE CASCADE,
      userid INT NOT NULL REFERENCES userstable(userid) ON DELETE CASCADE,
      answer TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await dbCon.query(createUsersTable);
    await dbCon.query(createQuestionsTable);
    await dbCon.query(createAnswersTable);
    console.log("Database tables checked and created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error.message);
    throw error;
  }
};

