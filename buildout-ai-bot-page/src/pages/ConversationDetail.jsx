import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getConversationById } from "../utils/storage";
import Message from "../components/Message";

export default function ConversationDetail(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [convo, setConvo] = useState(null);

  useEffect(()=>{
    setConvo(getConversationById(id));
  },[id]);

  if(!convo){
    return (
      <div className="card" style={{ padding:16 }}>
        <h1 style={{ marginTop:0 }}>Conversation</h1>
        <p className="empty">Not found.</p>
        <button className="btn" type="button" onClick={()=>navigate("/history")}>Back to History</button>
      </div>
    );
  }

  const { title, createdAt, messages=[], feedback } = convo;

  return (
    <div className="card" style={{ padding:16 }}>
      <h1 style={{ marginTop:0 }}>Conversation</h1>
      <h3 style={{ marginBottom:4 }}>{title}</h3>
      <small>{new Date(createdAt).toLocaleString()}</small>

      <div className="card chat-window" style={{ marginTop:12 }}>
        {messages.length===0
          ? <p className="empty">No messages.</p>
          : messages.map(m=>(
              <Message
                key={m.id}
                role={m.role}
                text={m.text}
                liked={m.liked}
                disliked={m.disliked}
                onLike={()=>{}}
                onDislike={()=>{}}
              />
            ))
        }
      </div>

      <div style={{ marginTop:12 }}>
        <strong>Feedback:</strong> {(feedback?.rating || 0)}/5
        <div style={{ whiteSpace:"pre-wrap", marginTop:4 }}>
          {feedback?.comment || "-"}
        </div>
      </div>

      <div style={{ marginTop:12, display:"flex", gap:8, flexWrap:"wrap" }}>
        <button className="btn" type="button" onClick={()=>navigate("/history")}>Back to History</button>
        <button className="btn" type="button" onClick={()=>navigate("/")}>Back to Chat</button>
      </div>
    </div>
  );
}
