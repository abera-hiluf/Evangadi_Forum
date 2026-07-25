import { Route, Routes, useNavigate } from "react-router-dom";
import axios from "./utiltis/api/api.js";
import { useEffect, useState, createContext } from "react";
import Home from "./pages/Home/Home.jsx";
import AskQuestions from "./pages/Questions/AskQuestion.jsx";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import Login from "./components/Auth/Login.jsx";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute.jsx";
import Answers from "./pages/Answers/Answers.jsx";
import SignUpPage from "./pages/Signup/SignUpPage.jsx";
import EditQuestion from "./pages/Questions/EditQuestion.jsx";
import PagesNotFound from "./pages/404/pagesNotFound.jsx";
import EditAnswer from "./pages/Answers/EditAnswer.jsx";
import HowItWorks from "./pages/HowItWorks/HowItWorks.jsx";

export const AppState = createContext();

function App() {
  const [appErrors, setAppErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  async function checkUser(currentToken) {
    try {
      const { data } = await axios.get("/users/check", {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
      setUser(data.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.log("checkUser error:", error.response?.data);
      setIsLoggedIn(false);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }

  const login = async (credentials) => {
    try {
      const { data } = await axios.post("/users/login", credentials);
      if (data.token) {
        localStorage.setItem("token", data.token);
        await checkUser(data.token);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser({});
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkUser(token);
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  }, [navigate]);

  return (
    <>
      <AppState.Provider
        value={{
          user,
          setUser,
          isLoggedIn,
          setIsLoggedIn,
          loading,
          appErrors,
          login,
          logout,
        }}
      >
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route
            path="/question"
            element={
              <ProtectedRoute>
                <AskQuestions />
              </ProtectedRoute>
            }
          />
          <Route path="/question/:id" element={<Answers />} />
          <Route path="/update/questions/:id" element={<EditQuestion />} />
          <Route path="/update/answers/:id" element={<EditAnswer />} />
          <Route path="*" element={<PagesNotFound />} />
        </Routes>
        <Footer />
      </AppState.Provider>
    </>
  );
}

export default App;
