import React from 'react'
import  { useEffect, useState } from "react";
import { useParams,useNavigate, Link } from "react-router-dom";
import axios from "../../utiltis/api/api";
import style from "./question.module.css"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
function AskQuestion() {
  const [title,setTitle]=useState("")
  const [description,setDescription]=useState("")
const navigate=useNavigate()
const [successMessage,setSuccessMessage]=useState("")

const handleSubmit=async (e)=>{
   e.preventDefault()
   const token=localStorage.getItem("token")
   const userid=localStorage.getItem("userid")
   try {
     const response = await axios.post(
       "/questions",
       { title, description, userid },
       {
         headers: { Authorization: `Bearer ${token}` },
       }
     );

       setSuccessMessage(response.data.msg || "Question posted successfully!")
       setTitle("");
       setDescription("");
       setTimeout(()=>{
         navigate('/')
       },3000)
   } catch (error) {
       console.error("Error posting question", error);
   }
}
  return (
    <div className={style.container}>
      <div className={style.steps}>
        <h2>Steps to write a good question</h2>
        <ul>
          <li>
            <CheckCircleRoundedIcon
              style={{
                color: "orange",
                marginRight: "3px",
                fontSize: "medium",
              }}
            />{" "}
            Summarize your problem in a one-line title.
          </li>
          <li>
            {" "}
            <CheckCircleRoundedIcon
              style={{
                color: "orange",
                marginRight: "3px",
                fontSize: "medium",
              }}
            />{" "}
            Describe your problem in more detail.
          </li>
          <li>
            {" "}
            <CheckCircleRoundedIcon
              style={{
                color: "orange",
                marginRight: "3px",
                fontSize: "medium",
              }}
            />{" "}
            Describe what you tried and what you expected to happen.
          </li>
          <li>
            {" "}
            <CheckCircleRoundedIcon
              style={{
                color: "orange",
                marginRight: "3px",
                fontSize: "medium",
              }}
            />{" "}
            Review your question and post it to the site.
          </li>
        </ul>
      </div>
      <h3 style={{ textAlign: "center" }}>
        Ask a public question <br />
        <Link style={{ fontSize: "12px" }} to={"/"}>
          Go To Question Page
        </Link>
      </h3>
      {successMessage && (
        <div
          style={{ color: "green", textAlign: "center", marginBottom: "1rem" }}
        >
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className={style.questionForm}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Question Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Post Your Question</button>
      </form>
    </div>
  );



}

export default AskQuestion