import React, { useEffect, useState } from "react";
import Login from "../../components/Auth/Login";
import Register from "../../components/Auth/Register";
import About from "../../components/About/About";
import style from "./signUp.module.css";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
function SignUpPage() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === "/login");

  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, [location.pathname]);

  return (
    <section className={style.authWrapper}>
      <div className={style.leftSide}>
        <div className={style.formBox}>
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              style={{ width: "100%" }}
            >
              {isLogin ? <Login /> : <Register />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className={style.rightSide}>
        <About />
      </div>
    </section>
  );
}

export default SignUpPage;
