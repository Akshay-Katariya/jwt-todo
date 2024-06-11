const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todos");
const authMiddleware = require("./middleware/auth");

const app = express();

app.use(express.json());

app.get("/", (req, res) => res.send("Express on Vercel"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", authMiddleware, todoRoutes);

mongoose
  .connect(config.mongoURI)
  .then(() => {
    app.listen(config.port, () =>
      console.log(`Server running on port ${config.port}`)
    );
  })
  .catch((err) => console.error(err));
