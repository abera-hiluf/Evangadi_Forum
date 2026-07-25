import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utiltis/api/api";
import style from "./answer.module.css";
function EditAnswer() {
  const { id } = useParams(); // answerid
  const [answerText, setAnswerText] = useState("");
  // const [questionId, setQuestionId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAnswer() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/answers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnswerText(res.data.answer);
        // setQuestionId(res.data.questionid);
      } catch (err) {
        console.error("Error fetching answer:", err);
        alert("Failed to load answer.");
      }
    }

    fetchAnswer();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/answers/${id}`,
        { answer: answerText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Answer updated!");
      navigate(`/`); // Updated navigation path to match Answers component route
    } catch (err) {
      console.error("Error updating answer:", err);
      alert("Failed to update answer.");
    }
  };

  return (
    <div
      style={{ padding: "20px", margin: "7% auto 0 auto", maxWidth: "900px" }}
    >
      <h2>Edit Answer</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          style={{
            width: "100%",
            minHeight: "150px",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            // focus: "outline: none; border-color: #007bff;",
          }}
          className={style.inputArea}
        />
        <button type="submit">Update Answer</button>
      </form>
    </div>
  );
}

export default EditAnswer;
