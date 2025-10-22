import React, { useState, useMemo } from "react";
import qa from "../data/stubQA.json";
import EndFeedback from "../components/EndFeedback";
import Message from "../components/Message";
import { saveConversation } from "../utils/storage";
import { useNavigate } from "react-router-dom";

const FALLBACK = "Sorry, Did not understand your query!";
const norm = (s) => (s || "").trim().toLowerCase();

export default function Chat(){
  const [messages, setMessages] = useState([]); // {id, role, text, liked?, disliked?}
  const [text, setText] = useState("");
  const [finished, setFinished] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  // Build fast lookup index from array
  const qaIndex = useMemo(()=>{
    const idx = {};
    qa.forEach(({ question, response }) => {
      idx[norm(question)] = response;
    });
    return idx;
  },[]);

 async function handleSubmit(e){
    e.preventDefault();
    if(finished) return;


    const userText = text.trim();
    if(!userText) return;
    // Temporary test call to Python server
try {
  const res = await fetch("http://127.0.0.1:8000/test");
  const data = await res.json();
  console.log("From Python:", data);
} catch (err) {
  console.error("Backend error:", err);
}


    const id = Date.now();
    const aiId = id + 1;
    let ans = qaIndex[norm(userText)];
    // let answe = qaData[userText];//

if (!ans) {
  try {
    const res = await fetch("http://127.0.0.1:8000/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: userText }),
    });
    const data = await res.json();
    ans = data.reply || "Sorry, Did not understand your query!";
  } catch (err) {
    console.error("AI backend error:", err);
    ans = "Sorry, backend not responding.";
  }
}


    setMessages(prev => ([
      ...prev,
      { id, role:"user", text:userText },
      { id: aiId, role:"ai", text: ans, liked:false, disliked:false }
    ]));
    setText("");
  }

  function toggleLike(id){
    setMessages(prev =>
      prev.map(m =>
        (m.id === id && m.role === "ai")
          ? { ...m, liked: !m.liked, disliked: m.liked ? m.disliked : false }
          : m
      )
    );
  }

  function toggleDislike(id){
    setMessages(prev =>
      prev.map(m =>
        (m.id === id && m.role === "ai")
          ? { ...m, disliked: !m.disliked, liked: m.disliked ? m.liked : false }
          : m
      )
    );
  }

  function handleFinish(){ setFinished(true); }

  function handleSaveConversation(){
    const convo = {
      title: messages.find(m=>m.role==="user")?.text || "Conversation",
      messages,
      feedback: { rating, comment },
      createdAt: new Date().toISOString()
    };
    const newId = saveConversation(convo);
    alert("Conversation saved with feedback!");
    setMessages([]); setRating(0); setComment(""); setFinished(false);
    navigate(`/history/${newId}`);
  }

  return (
    <div className="chat-wrap">
      <div className="card chat-window">
        {messages.length===0
          ? <p className="empty">Start chatting below.</p>
          : messages.map(m => (
              <Message
                key={m.id}
                role={m.role}
                text={m.text}
                liked={m.liked}
                disliked={m.disliked}
                onLike={()=>toggleLike(m.id)}
                onDislike={()=>toggleDislike(m.id)}
              />
            ))
        }
      </div>

      <form className="form card" onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder="Message Bot AI…"
          value={text}
          onChange={e=>setText(e.target.value)}
          disabled={finished}
        />
        {/* Ask must be type="submit" */}
        <button className="btn primary" type="submit" disabled={finished}>Ask</button>
        <button className="btn warn" type="button" onClick={handleFinish} disabled={finished || messages.length===0}>
          Finish
        </button>
      </form>

      {finished && (
        <EndFeedback
          rating={rating}
          comment={comment}
          onRate={setRating}
          onComment={setComment}
          onSave={handleSaveConversation}
        />
      )}
    </div>
  );
}
