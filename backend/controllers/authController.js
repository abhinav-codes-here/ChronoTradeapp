// backend/controllers/authController.js
const User = require("../models/User");
const Skill = require("../models/Skill");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/token");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, skillsOffered = [], skillsNeeded = [] } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, skillsOffered, skillsNeeded });

    // Save skills
    const skillDocs = skillsOffered.map(skill => ({
      ...skill,
      teacher: user._id,
    }));
    if (skillDocs.length > 0) await Skill.insertMany(skillDocs);

    const token = generateToken(user._id);
    const userData = user.toObject();
    delete userData.passwordHash;

    res.status(201).json({ user: userData, token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
      return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user._id);
    const userData = user.toObject();
    delete userData.passwordHash;

    res.json({ user: userData, token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.userId).populate("wishlist");
  if (!user) return res.status(404).json({ message: "User not found" });

  const userData = user.toObject();
  delete userData.passwordHash;
  res.json({ user: userData });
};
//