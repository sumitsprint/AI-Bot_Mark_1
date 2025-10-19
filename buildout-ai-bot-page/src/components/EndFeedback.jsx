import React from "react";

export default function EndFeedback({ rating, comment, onRate, onComment, onSave }){
  return (
    <div className="feedback card">
      <h3 style={{ marginTop: 0 }}>End of Conversation Feedback</h3>

      <div className="stars">
        {[1,2,3,4,5].map(n => (
          <button
            key={n}
            type="button"
            className={`star ${n <= rating ? "active" : ""}`}
            onClick={() => onRate(n)}
            aria-label={`rate ${n}`}
            title={`Rate ${n}`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        className="textarea"
        rows={3}
        placeholder="Add your feedback…"
        value={comment}
        onChange={(e)=>onComment(e.target.value)}
      />

      <div style={{ marginTop: 10, display:"flex", gap:8, flexWrap:"wrap" }}>
        {/* Spec: Save is type="button" */}
        <button type="button" className="btn primary" onClick={onSave}>
          Save Conversation
        </button>
      </div>
    </div>
  );
}
