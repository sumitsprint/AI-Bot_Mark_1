import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getConversations, clearConversations } from "../utils/storage";

export default function History(){
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{ setList(getConversations()); },[]);

  function handleClear(){
    if(!confirm("Clear all conversations?")) return;
    clearConversations();
    setList([]);
  }

  return (
    <div className="card" style={{ padding:16 }}>
      <h1 style={{ marginTop:0 }}>Past Conversations</h1>

      <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
        <button className="btn" type="button" onClick={()=>navigate("/")}>Back to Chat</button>
        <button className="btn" type="button" onClick={handleClear}>Clear All</button>
      </div>

      {list.length===0 ? (
        <p className="empty">No conversations yet.</p>
      ) : (
        <ul className="list">
          {list.map(c=>(
            <li key={c.id} className="item">
              <h3>{c.title}</h3>
              <small>{new Date(c.createdAt).toLocaleString()}</small>
              <div style={{ marginTop:8 }}>
                <strong>Feedback:</strong> {(c.feedback?.rating || 0)}/5
                <div style={{ whiteSpace:"pre-wrap", marginTop:4 }}>
                  {c.feedback?.comment || "-"}
                </div>
              </div>
              <div style={{ marginTop:8 }}>
                <button className="btn" type="button" onClick={()=>navigate(`/history/${c.id}`)}>
                  View Conversation
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
