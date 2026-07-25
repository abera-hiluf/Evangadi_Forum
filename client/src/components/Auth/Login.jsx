import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./login.module.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { AppState } from "../../App";

function Login() {
  const [errors, setErrors] = useState({});
  // Access login function from context
  const { login, user, appErrors } = useContext(AppState); // Access login function from context
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // Initializes the navigate function
  const navigate = useNavigate();
  //Creates a reference to the email and Password input field and allowing you to access its value directly.
  const userEmail = useRef();
  const userPassword = useRef();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/", { replace: true });
    }
  }, []);
  //handle form submission.
  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({}); //clear previous error
    //Retrieves the current value of the email & Password input field.
    const userEmailValue = userEmail.current.value;
    const userPasswordValue = userPassword.current.value;
    //Checks if either the email or password fields are empty.
    let hasError = false;
    const newError = {};
    if (!userEmailValue && !userPasswordValue) {
      newError.all = "Please provide all required filds";
      hasError = true;
    }
    if (!userEmailValue) {
      newError.email = "Please provide required email";
      hasError = true;
    }
    if (!userPasswordValue) {
      newError.password = "Please provide  required password";
      hasError = true;
    }
    if (hasError) {
      setErrors(newError);
      return;
    }

    try {
      //Sends a POST request to the /user/login endpoint with the email and password.
      await login({
        email: userEmailValue,
        password: userPasswordValue,
      });

      //Redirects the user to the home page after a successful login
      // navigate("/");

      //to handle any errors that occur during the HTTP request.
    } catch (error) {
      const message =
        error?.response?.data?.msg ||
        error?.response?.data?.error ||
        "Something went wrong. Please try again.";
      console.log("Login error:", message);
      setErrors({ general: message });
    }
  }

  return (
    <>
      <br />
      <section className={classes.loginContainer}>
        <div className="container px-md-5">
          <div className="row">
            <div className="col-12  shadow auth mx-md-4 my-md-5">
              <div className={classes.login_inner}>
                <div className={classes.Carousel_inner}>
                  <div className="carousel-item active">
                    <h3>Login to your account</h3>
                    <div>
                      Don't have an account?
                      <span>
                        <Link to={"/register"}> Create a new account</Link>
                      </span>
                    </div>
                    {/* error happen on input fileds */}
                    {errors && Object.values(errors).length > 0 && (
                      <div className={classes.server_error}>
                        <div>{Object.values(errors)[0]}</div>
                      </div>
                    )}
                    <form onSubmit={handleSubmit} className={classes.form}>
                      <div
                        className={
                          errors.email
                            ? classes.error_input
                            : classes.from_input
                        }
                      >
                        <input
                          type="email"
                          placeholder="Email"
                          ref={userEmail}
                        />
                        <span className={classes.line}></span>
                      </div>
                      <br />
                      <div
                        className={
                          errors.password
                            ? classes.error_input
                            : classes.from_input
                        }
                      >
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          ref={userPassword}
                        />
                        <span className={classes.line}></span>
                        <span
                          className={
                            errors.password
                              ? classes.password_toggle_error
                              : classes.password_toggle
                          }
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <FiEye /> : <FiEyeOff />}
                        </span>
                      </div>
                      <div className={classes.forget}>
                        <Link to={"/login"}>Forgot password</Link>
                      </div>
                      <div className={classes.btn}>
                        <button type="submit">Login</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default Login;
