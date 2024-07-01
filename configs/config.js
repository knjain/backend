// Load environment variables from .env file
require("dotenv").config();
const mongoose = require("mongoose");
const AWS = require("aws-sdk");

// ############### AWS configs ###############

const S3 = new AWS.S3({
  endpoint: "s3.amazonaws.com",
  accessKeyId: process.env.ACCESS_KEY, // Put you accessKeyId
  secretAccessKey: process.env.ACCESS_SECRET, // Put you accessKeyId
  Bucket: process.env.BUCKET,
  signatureVersion: "v4",
  region: process.env.region,
});

// ############### MongoDB configs ###############

const PORT = process.env.PORT || 8000;

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_CLUSTER = process.env.MONGODB_CLUSTER;
const MONGODB_DATABASE_NAME = process.env.MONGODB_DATABASE_NAME;

const MONGODB_URI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.${MONGODB_CLUSTER}.mongodb.net/${MONGODB_DATABASE_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mongodb = mongoose.connection;
mongodb.on("error", console.error.bind(console, "MongoDB connection error:"));
mongodb.once("open", () => {
  console.log("Connected to MongoDB!");
});

// ############### Filters ###############

const POST_TYPES = ["IMAGE", "VIDEO", "AUDIO", "GIF", "DOC", "NONE"];

// ############## FOLDERS ###############
const POST_MEDIA_FOLDER = [
  "posts-images",
  "posts-videos",
  "posts-audios",
  "posts-gifs",
  "posts-docs",
];

const THUMBNAIL_PATH = "thumbnails";

module.exports = {
  PORT: PORT,
  MONGODB_URI: MONGODB_URI,
  THUMBNAIL_PATH: THUMBNAIL_PATH,
  POST_TYPES: POST_TYPES,
  POST_MEDIA_FOLDER: POST_MEDIA_FOLDER,
  S3: S3,
  AWS_BUCKET: process.env.BUCKET,
};
