import express from "express";
import cors from "cors";
import axios from "axios";
const app = express();

const PORT = 4005 || process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const events = [];
app
  .route("/events")
  .get((req, res, next) => {
    try {
      res.send(events);
    } catch (error) {
      next(error);
    }
  })
  .post((req, res, next) => {
    try {
      const event = req.body;
      events.push(event);
      axios.post("http://post-service-clusterip-srv:4000/events", event);
      axios.post("http://comment-service-srv:4001/events", event);
      axios.post("http://query-service-srv:4002/events", event);
      axios.post("http://moderation-service-srv:4003/events", event);
      res.send({ status: "OK", event });
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
  console.log(`Event bus listen on port ${PORT}`);
});
