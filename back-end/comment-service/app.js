import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import axios from "axios";
import { randomBytes } from "crypto";

const app = express();
const PORT = 4001 || process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const commentByPostId = {};
app
  .route("/posts/:id/comments")
  .get(async (req, res, next) => {
    try {
      res.send(commentByPostId[req.params.id] || []);
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const commentId = randomBytes(4).toString("hex");
      const postId = req.params.id;
      const { content } = req.body;
      const comments = commentByPostId[postId] || [];
      comments.push({ id: commentId, content, status: "pending" });
      commentByPostId[postId] = comments;
      await axios.post("http://event-bus-srv:4005/events", {
        type: "CommentCreated",
        data: {
          id: commentId,
          content,
          postId,
          status: "pending",
        },
      });
      res.send(comments);
    } catch (error) {
      console.log(error.message);

      next(error);
    }
  });
app.post("/events", async (req, res, next) => {
  try {
    const { type, data } = req.body;
    if (type === "CommentModerated") {
      const comments = commentByPostId[data.postId];
      const comment = comments.find((e) => (e.id === data.id));
      comment.status = data.status;
      await axios.post("http://event-bus-srv:4005/events", {
        type: "CommentUpdated",
        data,
      });
    }
    console.log("Event received in comment service:", { type, data });
    res.send({ type, data });
  } catch (error) {
    next(error);
  }
});
// ----------ROUTER----------
// ----------HANDLER ERROR----------
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  const message = error.message;
  const status = error.status || 500;
  res.status(status);
  let err = {
    status,
    message,
  };

  res.send({
    error: {
      ...err,
    },
  });
});

app.listen(PORT, () => console.log(`Comment service listen on port ${PORT}`));
