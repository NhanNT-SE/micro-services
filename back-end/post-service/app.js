import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { randomBytes } from "crypto";
import axios from "axios";

const app = express();
const PORT = 4000 || process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const posts = {};
app.get("/posts", async (req, res, next) => {
  try {
    res.send(posts);
  } catch (error) {
    next(error);
  }
});
app.post("/posts/create", async (req, res, next) => {
  try {
    const id = randomBytes(4).toString("hex");
    const { title } = req.body;
    posts[id] = {
      id,
      title,
    };
    await axios.post("http://event-bus-srv:4005/events", {
      type: "PostCreated",
      data: {
        id,
        title,
      },
    });
    res.send(posts[id]);
  } catch (error) {
    console.log(error.message);

    next(error);
  }
});

app.post("/events", async (req, res, next) => {
  try {
    const { type, data } = req.body;
    console.log("Event received in post service:", type);

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
  //   const message = mapErrorMessage(error);
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

app.listen(PORT, () => {
  console.log(`Post service listen on port ${PORT}`);
});
