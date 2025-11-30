// backend/controllers/skillController.js
const Skill = require("../models/Skill");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

exports.searchSkills = async (req, res) => {
  const { q } = req.query;
  const filter = q
    ? { $or: [{ name: new RegExp(q, "i") }, { tags: { $regex: q, $options: "i" } }] }
    : {};

  const skills = await Skill.find(filter).populate("teacher", "name");
  res.json(skills);
};

exports.addToWatchlist = async (req, res) => {
  const skillId = req.params.skillId;
  const user = await User.findById(req.userId);
  if (!user.wishlist.includes(skillId)) {
    user.wishlist.push(skillId);
    await user.save();
  }
  res.json({ message: "Added to watchlist" });
};

exports.startLearningSession = async (req, res) => {
  const { skillId } = req.params;
  const { hours = 1 } = req.body;
  const skill = await Skill.findById(skillId);
  const learner = await User.findById(req.userId);
  const teacher = await User.findById(skill.teacher);
  const requiredCredits = skill.timeCredit * hours;

  if (learner.walletBalance < requiredCredits)
    return res.status(400).json({ message: "Not enough credits" });

  learner.walletBalance -= requiredCredits;
  teacher.walletBalance += requiredCredits;
  await learner.save();
  await teacher.save();

  const tx = await Transaction.create({ fromUser: learner._id, toUser: teacher._id, skill: skillId, hours });
  res.json({ message: "Session done!", transaction: tx });
};
