// backend/routes/skills.js
const express = require("express");
const Skill = require("../models/Skill");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// SEARCH SKILLS (by name or tag)
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    const filter = q
      ? {
          $or: [
            { name: new RegExp(q, "i") },
            { tags: { $elemMatch: { $regex: q, $options: "i" } } }
          ]
        }
      : {};

    const skills = await Skill.find(filter).populate("teacher", "name");
    res.json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ADD TO WATCHLIST
router.post("/:skillId/watchlist", authMiddleware, async (req, res) => {
  try {
    const { skillId } = req.params;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.wishlist.includes(skillId)) {
      user.wishlist.push(skillId);
      await user.save();
    }

    res.json({ message: "Added to wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// START LEARNING (conduct session + credit transfer + ledger entry)
router.post("/:skillId/start", authMiddleware, async (req, res) => {
  try {
    const { skillId } = req.params;
    const { hours = 1 } = req.body;

    const skill = await Skill.findById(skillId);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    const learner = await User.findById(req.userId);
    const teacher = await User.findById(skill.teacher);

    if (!learner || !teacher)
      return res.status(404).json({ message: "User not found" });

    const totalCredits = skill.timeCredit * hours;

    // Simple data flow:
    // 3. Teaching session conducted → credit transferred.
    // 4. Wallet updated → transaction stored in ledger.
    if (learner.walletBalance < totalCredits) {
      return res.status(400).json({ message: "Not enough credits" });
    }

    learner.walletBalance -= totalCredits;
    teacher.walletBalance += totalCredits;

    await learner.save();
    await teacher.save();

    const tx = await Transaction.create({
      fromUser: learner._id,
      toUser: teacher._id,
      skill: skill._id,
      hours
    });

    res.json({
      message: "Session completed and credits transferred",
      transaction: tx,
      walletBalance: learner.walletBalance
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// USER LEDGER / WALLET
router.get("/ledger/me", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ fromUser: req.userId }, { toUser: req.userId }]
    })
      .populate("skill", "name")
      .sort({ createdAt: -1 });

    const user = await User.findById(req.userId);
    res.json({ walletBalance: user.walletBalance, transactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
//