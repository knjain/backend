const express = require("express");
const router = express.Router();

// Routes
const postRoutes = require("./routes/post.route");

// Endpoints
router.use("/api/v1/posts", postRoutes);

module.exports = router;