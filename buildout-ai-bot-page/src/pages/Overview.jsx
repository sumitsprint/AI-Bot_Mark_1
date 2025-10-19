import React, { useEffect, useState } from "react";
import { getConversations } from "../utils/storage";

export default function Overview(){
  const [convos, setConvos] = useState([]);
  const [filter, setFilter] = useState(0);

  useEffect(()=>{ setConvos(getConversations()); },[]);

  const filtered = filter===0 ? convos : convos.filter(c => (c.feedback?.rating || 0) >= filter);

  return (
    <div className="card" style={{ padding:16 }}>
      <h1 style={{ marginTop:0 }}>Feedback Overview</h1>

      <div style={{ marginBottom:12 }}>
        <label htmlFor="filter" style={{ marginRight:8, color:"#cbd5e1" }}>Filter by rating:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e)=>setFilter(Number(e.target.value))}
          className="input"
          style={{ maxWidth:220 }}
        >
          <option value={0}>All</option>
          <option value={3}>≥ 3 stars</option>
          <option value={4}>≥ 4 stars</option>
          <option value={5}>Only 5 stars</option>
        </select>
      </div>

      {filtered.length===0 ? (
        <p className="empty">No feedback matching this filter.</p>
      ) : (
        <ul className="list">
          {filtered.map(c=>(
            <li key={c.id} className="item">
              <h3>{c.title}</h3>
              <small>{new Date(c.createdAt).toLocaleString()}</small>
              <div style={{ marginTop:8 }}>
                <strong>Rating:</strong> {(c.feedback?.rating || 0)}/5
                <div style={{ whiteSpace:"pre-wrap", marginTop:4 }}>
                  {c.feedback?.comment || "-"}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
