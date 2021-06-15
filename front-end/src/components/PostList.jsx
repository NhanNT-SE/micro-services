import axios from "axios";
import React, { useEffect, useState } from "react";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

function PostList() {
  const [posts, setPosts] = useState([]);

  const fetchPost = async () => {
    const response = await axios.get("http://posts.com/posts");
    const { data } = response;
    setPosts(data);
  };
  const renderPost = Object.values(posts).map((post) => {
    return (
      <div
        className="card"
        style={{ width: "40%", marginBottom: "20px" }}
        key={post.id}
      >
        <div className="card-body">
          <h5>{post.title}</h5>
          <CommentList comments={post.comments} />
          <CommentCreate postId={post.id} />
        </div>
      </div>
    );
  });

  useEffect(() => {
    fetchPost();
  }, []);
  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {renderPost}
    </div>
  );
}

export default PostList;
