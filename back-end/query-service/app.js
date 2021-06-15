import express from "express";
import cors from "cors";
import axios from "axios";
const app = express();

const PORT = 4002 || process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const posts = {};
const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    posts[data.id] = { ...data, comments: [] };
  }
  if (type === "CommentCreated") {
    posts[data.postId].comments.push(data);
  }

  if (type === "CommentUpdated") {
    const post = posts[data.postId];
    const comment = post.comments.find((e) => e.id === data.id);
    comment.status = data.status;
    comment.content = data.content;
  }
};
app.get("/posts", (req, res, next) => {
  try {
    res.send(posts);
  } catch (error) {
    next(error);
  }
});

app.post("/events", async (req, res, next) => {
  try {
    const { type, data } = req.body;

    handleEvent(type, data);
    console.log("Event received in query service:", { type, data });

    res.send(posts);
  } catch (error) {
    console.log(error.message);

    next(error);
  }
});

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
app.listen(PORT, async () => {
  console.log(`Query service listen on port ${PORT}`);
  const res = await axios.get("http://event-bus-srv:4005/events");
  for (let event of res.data) {
    console.log("Processing event:", event.type);
    handleEvent(event.type, event.data);
  }
});
