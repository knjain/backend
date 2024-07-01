const postService = require("../services/post.service");
const ApiError = require("../utils/apiError.util");
const fileUpload = require("../utils/fileUpload.util");
const configs = require("../configs/config");
const errors = require("../utils/errorResponse.util");
const stringUtil = require("../utils/handleString.util");
const MasterTags = require("../models/tags.model");
module.exports = {
  createPost: async (req, res, next) => {
    try {
      const { title, desc, mediaType, tags, locationCoordinates, gifUrl } =
        req.body;

      // Check if required fields are present
      const requiredFields = [
        { name: "mediaType", message: "Missing mediaType field" },
      ];

      for (const field of requiredFields) {
        if (!req.body[field.name] || req.body[field.name] === "") {
          return errors.error400(next, field.message);
        }
      }

      if (!configs.POST_TYPES.includes(mediaType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid mediaType. Allowed values: ${configs.POST_TYPES}`,
        });
      }

      const mediaUrls = [];
      const thumbnailUrls = [];
      console.log("mediaType", mediaType);
      if (mediaType !== "NONE") {
        const index = configs.POST_TYPES.indexOf(mediaType);
        const folderPath = configs.POST_MEDIA_FOLDER[index];
        console.log(req.files);
        // Upload media files to S3 and store URLs
        if (req.files["media"]) {
          for (const file of req.files["media"]) {
            const mediaUrl = await fileUpload.handleFileUploadForPost(
              file,
              folderPath
            );
            mediaUrls.push(mediaUrl);
          }
        }

        // Upload thumbnail files to S3 and store URLs
        if (req.files["thumbnail"]) {
          for (const file of req.files["thumbnail"]) {
            const thumbnailUrl = await fileUpload.handleFileUploadForPost(
              file,
              folderPath
            );
            thumbnailUrls.push(thumbnailUrl);
          }
        }
      }

      const tagsList = stringUtil.convertStringToList(tags);
      const coordinatesList =
        stringUtil.convertStringToList(locationCoordinates);

      const tagIds = [];
      for (const tag of tagsList) {
        let tagDoc = await MasterTags.findOne({ key: tag });
        if (!tagDoc) {
          tagDoc = new MasterTags({ key: tag });
          await tagDoc.save();
        }
        //console.log(tagDoc);
        tagIds.push(tagDoc._id);
      }

      console.log("mediaUrls", mediaUrls);
      // Create post data
      const postData = {
        title,
        desc,
        mediaType,
        mediaUrls,
        thumbnailUrls,
        tags: tagIds,
        locationCoordinates: coordinatesList,
        gifUrl,
      };

      // Create post using service
      const response = await postService.createPost(postData);

      return res
        .status(201)
        .json({ data: response, success: true, message: "Post created" });
    } catch (error) {
      next(error);
    }
  },

  getAllPosts: async (req, res, next) => {
    try {
      const { offset, limit, sort, keyword, tag } = req.query;

      const postList = await postService.getAllPosts(
        offset,
        limit,
        sort,
        keyword,
        tag
      );

      return res.status(200).json({ data: postList, success: true });
    } catch (error) {
      next(error);
    }
  },
};
