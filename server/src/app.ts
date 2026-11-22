import express from "express";

const app = express();

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello from Wedding Planner API! Let's get to work!",
  });
});

export default app;