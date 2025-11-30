// backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Skill = require("../models/Skill");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Helper to create token
const createToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, skillsOffered = [], skillsNeeded = [] } =
      req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      skillsOffered,
      skillsNeeded,
      walletBalance: 0
    });

    // also create Skill docs for searching/matching
    const skillDocs = skillsOffered.map((s) => ({
      name: s.name,
      description: s.description || "",
      tags: s.tags || [],
      timeCredit: s.timeCredit || 1,
      teacher: user._id
    }));

    if (skillDocs.length > 0) {
      await Skill.insertMany(skillDocs);
    }

    const token = createToken(user._id);
    const userData = user.toObject();
    delete userData.passwordHash;

    res.status(201).json({ user: userData, token });
  } catch (err) {
    console.error("Registration error:", err);
    const status = err.name === "ValidationError" ? 400 : 500;
    res.status(status).json({ message: err.message || "Server error" });
  }
});// done by chat: added error logging and status code handling

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = createToken(user._id);
    const userData = user.toObject();
    delete userData.passwordHash;

    res.json({ user: userData, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET CURRENT USER (with wishlist + wallet + skills)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });

    const userData = user.toObject();
    delete userData.passwordHash;

    res.json({ user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
