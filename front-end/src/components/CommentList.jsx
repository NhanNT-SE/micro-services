import React from "react";

function CommentList({ comments }) {
  const renderComments = comments.map((comment) => {
    let content;
    const { status } = comment;
    if (status === "approved") {
      content = comment.content;
    }
    if (status === "rejected") {
      content = "This comment has been rejected !";
    }
    if (status === "pending") {
      content = "This comment is awaiting moderation";
    }
    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderComments}</ul>;
}

export default CommentList;
