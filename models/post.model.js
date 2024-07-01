const mongoose = require("mongoose");
const { POST_TYPES } = require("../configs/config");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    desc: {
      type: String,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MasterTags",
      },
    ],
    mediaType: {
      type: String,
      enum: POST_TYPES,
      required: true,
    },
    locationCoordinates: [
      {
        type: String,
      },
    ],
    mediaUrls: [
      {
        type: String,
      },
    ],
    thumbnailUrls: [
      {
        type: String,
      },
    ],
    gifUrl: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    repostedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    repostCaption: {
      type: String,
    },
    reposts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
