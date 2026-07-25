import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utiltis/api/api";
import styles from "./Home.module.css";
import { AppState } from "../../App";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "../Pagination/Pagination";
function Home() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user, setIsLoggedIn } = useContext(AppState);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const answersPerPage = 4;

  // Calculate pagination values based on real answers
  const indexOfLastAnswer = currentPage * answersPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
  const currentAnswers = questions.slice(indexOfFirstAnswer, indexOfLastAnswer);
  const totalItems = questions.length;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // Check user auth
        const { data: userData } = await api.get("/users/check");
        setIsLoggedIn(true);

        // Get all questions
        const { data } = await api.get("/questions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setQuestions(data.questions);
      } catch (err) {
        console.error(
          "Auth or fetch error:",
          err.response?.data || err.message
        );

        if (
          err.response?.status === 401 ||
          err.response?.data?.msg === "Invalid token"
        ) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Something went wrong. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAskClick = () => navigate("/question");
  const handleQuestionClick = (id) => navigate(`/question/${id}`);
  const handleEditQuestion = (id) => navigate(`/update/questions/${id}`);

  // delete question
  const handleDelete = async (e, id) => {
    e.preventDefault(); // prevent navigating to question page
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await api.delete(`/questions/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setQuestions((prevQuestions) =>
          prevQuestions.filter((q) => q.question_id !== id)
        );
      } catch (err) {
        console.error("Error deleting question:", err);
      }
    }
  };
  const filteredQuestions = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className={styles.message}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={handleAskClick} className={styles.askButton}>
          Ask a Question
        </button>
        <div>
          <h2>
            Welcome{" "}
            <span style={{ color: "" }}>{user?.username || "Guest"}</span>
          </h2>
          <div className={styles.searcContainer}>
            <SearchRoundedIcon className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </header>
      <hr />
      <h3 className={styles.heading}>Latest Questions</h3>

      {questions.length === 0 ? (
        <p className={styles.message}>No questions posted yet.</p>
      ) : filteredQuestions.length === 0 ? (
        <p className={styles.message}>No matching questions found.</p>
      ) : (
        <ul className={styles.list}>
          {filteredQuestions.map((q) => (
            <li
              key={q.question_id}
              className={styles.listItem}
              onClick={() => handleQuestionClick(q.question_id)}
            >
              <div className={styles.avatar}>
                {q.user_name?.[0]?.toUpperCase() || "?"}
              </div>
              <div className={` ${styles.content}`}>
                <h4 className={`text-xl font`}>{q.title}</h4>
                <p className={styles.author}>Asked by {q.user_name}</p>
                <p className={styles.meta}>
                  {q.answerCount} {q.answerCount === 1 ? "answer" : "answers"}
                </p>
              </div>
              {/* <div className={styles.arrow}>&gt;</div> */}
              {/* edit question */}
              {user.username === q.user_name && (
                <button
                  className={styles.editButton}
                  onClick={(e) => {
                    e.stopPropagation();

                    handleEditQuestion(q.question_id);
                  }}
                >
                  <EditIcon /> Edit
                </button>
              )}
              {/* delete quesion*/}
              {user?.username === q.user_name && (
                <button
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(e, q.question_id);
                  }}
                >
                  <DeleteIcon /> Delete
                </button>
              )}
            </li>
          ))}
          <Pagination
            itemsPerPage={answersPerPage}
            totalItems={filteredQuestions.length}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </ul>
      )}
    </div>
  );
}

export default Home;
