const express = require("express");
const Todo = require("../models/todo");
const auth = require("../middleware/auth");

const router = express.Router();

// Create Todo
router.post("/", auth, async (req, res) => {
  const { title, description } = req.body;

  try {
    const todo = new Todo({
      user: req.user.id,
      title,
      description,
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Todos
router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.status(200).json(todos);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Todo by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo || todo.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update Todo
router.put("/:id", auth, async (req, res) => {
  const { title, description, completed } = req.body;

  try {
    let todo = await Todo.findById(req.params.id);

    if (!todo || todo.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Todo not found" });
    }

    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.completed = completed !== undefined ? completed : todo.completed;

    await todo.save();
    res.status(200).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Todo
router.delete("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo || todo.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Todo not found" });
    }

    await Todo.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Todo removed" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
