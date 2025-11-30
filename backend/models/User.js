// backend/models/User.js
const mongoose = require("mongoose");

const offeredSkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  tags: [String],
  timeCredit: { type: Number, default: 1 } // how many credits per session
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    skillsOffered: [offeredSkillSchema],
    skillsNeeded: [String],
    walletBalance: { type: Number, default: 0 },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
