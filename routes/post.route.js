const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const multer = require("multer");
const configs = require("../configs/config");
const upload = multer({ dest: configs.AWS_BUCKET });

// GET Routes
router.get("/", postController.getAllPosts);

// POST Routes
router.post(
  "/",

  upload.fields([
    { name: "media", maxCount: 5 },
    { name: "thumbnail", maxCount: 5 },
  ]),
  postController.createPost
);

module.exports = router;
