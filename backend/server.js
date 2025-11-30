// ============================================
// ChronoTrade Backend - server.js
// ============================================

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows JSON request bodies

// Connect to MongoDB
connectDB();

// Default Root Route (Just for testing)
app.get("/", (req, res) => {
  res.send("🚀 ChronoTrade Backend Server is Running");
});
// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/skills", require("./routes/skills"));

// Handle Invalid Routes
app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Global Error Handler (optional but best practice)
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});

// Server Listen
const PORT = process.env.PORT || 5001; // Port defaulted to 5001 to dodge macOS Control Center on 5000.
app.listen(PORT, () => {
  console.log(`⚙️ Server is running on port ${PORT}`);
});
