const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../config");
const auth = require("../middleware/auth");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, config.jwtSecret, {
      expiresIn: "1h",
    });
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, config.jwtSecret, {
      expiresIn: config.expiresIn,
    });
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update Profile
router.put("/profile", auth, async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
