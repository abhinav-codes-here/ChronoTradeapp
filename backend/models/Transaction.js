// backend/models/Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // learner
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },   // teacher
    skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill" },
    hours: { type: Number, default: 1 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
