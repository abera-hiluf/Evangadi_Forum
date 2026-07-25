import React from "react";
import { useNavigate } from "react-router-dom";
import About from "../../components/About/About";
import styles from "./HowItWorks.module.css";

function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <About />
    </div>
  );
}

export default HowItWorks;
