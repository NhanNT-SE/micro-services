import express from "express";
import cors from "cors";
import axios from "axios";
const app = express();

const PORT = 4003 || process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/events", async (req, res, next) => {
  try {
    const { type, data } = req.body;
    if (type === "CommentCreated") {
      const status = data.content.includes("orange") ? "rejected" : "approved";
      await axios.post("http://event-bus-srv:4005/events", {
        type: "CommentModerated",
        data: { ...data, status },
      });
    }
    console.log("Event received in moderation service:", type);
    res.send({});
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

app.listen(PORT, () => {
  console.log(`Moderation service listen on port ${PORT}`);
});
