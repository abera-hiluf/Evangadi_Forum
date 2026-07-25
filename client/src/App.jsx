import { Route, Routes, useNavigate } from "react-router-dom";
import axios from "./utiltis/api/api.js";
// import Register from "./components/Auth/Register.jsx";
// Imports an instance of axios (a library for making HTTP requests) configured with your settings.

// Imports React hooks. useState is used to manage state, useEffect is used to perform side effects (e.g., data fetching) and createContext to create a context for for sharing state across the components.
import { useEffect, useState, createContext } from "react";
import Home from "./pages/Home/Home.jsx";
import AskQuestions from "./pages/Questions/AskQuestion.jsx";
// import QuestionAndAnswer from "./pages/Home/QuestionAndAnswer/QuestionAndAnswer.jsx";
// import About from "./pages/Signup/About.jsx";
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
//provide and consume state throughout the application.
export const AppState = createContext();
function App() {
  const [appErrors, setAppErrors] = useState({});
  const [loading, setLoading] = useState(true);

  //State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //Initializes state to store user information.
  const [user, setUser] = useState({});
  //Initializes the navigate to navigate to different routes.
  const navigate = useNavigate();
  //Retrieves the token from local storage, which used for authenticated requests.
  //check if the user is authenticated.
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
      setLoading(false); // mark auth check done
    }
  }

  const login = async (credentials) => {
    try {
      const { data } = await axios.post("/users/login", credentials);
      console.log("Login response:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("Token stored:", localStorage.getItem("token")); // confirm stored
        await checkUser(data.token);
        console.log("After checkUser token:", localStorage.getItem("token")); // confirm still there
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
  //Calls the checkUser function when the component mounts or when token changes.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkUser(token);
    } else {
      setIsLoggedIn(false);
      setLoading(false); // no token, skip check
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
          <Route
            path="/question"
            element={
              <ProtectedRoute>
                <AskQuestions />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/about" element={<SignUpPage />} /> */}
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
