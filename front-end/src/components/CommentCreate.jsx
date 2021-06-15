import axios from "axios";
import React, { useState } from "react";

function CommentCreate({ postId }) {
  const [content, setContent] = useState("");
  const onSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`http://posts.com/posts/${postId}/comments`, { content });
    setContent("");
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Create comment</label>
          <input
            type="text"
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default CommentCreate;
