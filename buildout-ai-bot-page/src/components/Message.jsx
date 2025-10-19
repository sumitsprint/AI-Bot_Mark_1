import React from "react";

export default function Message({ role, text, liked, disliked, onLike, onDislike }){
  if(role === "ai"){
    return (
      <div className="msg ai ai-card">
        <span className="label">Soul AI</span>
        <p>{text}</p>

        <div className="ai-actions">
          <button
            type="button"
            className={liked ? "active" : ""}
            onClick={onLike}
            aria-label="thumbs up"
            title="Like"
          >👍</button>
          <button
            type="button"
            className={disliked ? "active" : ""}
            onClick={onDislike}
            aria-label="thumbs down"
            title="Dislike"
          >👎</button>
        </div>
      </div>
    );
  }

  return (
    <div className="msg user">
      <p style={{ margin: 0 }}>{text}</p>
    </div>
  );
}
