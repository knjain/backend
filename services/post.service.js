const Post = require("../models/post.model");
const ApiError = require("../utils/apiError.util");
const configs = require("../configs/config");
const MasterTags = require("../models/tags.model");

module.exports = {
  createPost: async (postData) => {
    try {
      const newPost = new Post({
        title: postData.title,
        desc: postData.desc,
        mediaType: postData.mediaType,
        mediaUrls: postData.mediaUrls,
        tags: postData.tags,
        locationCoordinates: postData?.locationCoordinates,
        thumbnailUrls: postData.thumbnailUrls,
        gifUrl: postData.gifUrl,
      });

      return new Promise((resolve, reject) => {
        newPost
          .save()
          .then((post) => {
            resolve(post);
          })
          .catch((error) => {
            console.log(error);
            reject(new ApiError(500, "Error saving post"));
          });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getAllPosts: async (
    offset = 0,
    limit = 10,
    sort = "createdAt",
    keyword,
    tag
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Build the query object
        let query = {};

        if (keyword) {
          query.$or = [
            { title: { $regex: keyword, $options: "i" } },
            { desc: { $regex: keyword, $options: "i" } },
          ];
        }

        if (tag) {
          const tagDoc = await MasterTags.findOne({ key: tag });
          if (tagDoc) {
            query.tags = tagDoc._id;
          } else {
            return res.status(200).json({
              data: [],
              success: true,
              message: "No posts found for the given tag",
            });
          }
        }

        const posts = await Post.find(query)
          .sort({ [sort]: 1 }) // Sort by the provided field
          .skip(Number(offset))
          .limit(Number(limit))
          .populate("tags", "key") // Populate the tags with their names
          .exec();

        const postList = posts.map((post) => {
          return {
            ...post.toObject(),
            tags: post.tags.map((tag) => tag.key), // Convert the tags to their names
          };
        });

        resolve(postList);
      } catch (error) {
        console.log(error);
        reject(new ApiError(500, "Something went wrong"));
      }
    });
  },
};