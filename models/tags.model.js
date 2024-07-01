const mongoose = require("mongoose");

const tagsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const MasterTags = mongoose.model("MasterTags", tagsSchema);

module.exports = MasterTags;
