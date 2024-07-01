const ApiError = require("./apiError.util");

module.exports = {
  convertStringToList: (stringList) => {
    // stringList format: "['str1','str2']"
    // return format: ["str1","str2"]

    // Check if the input is a string
    if (typeof stringList !== "string") {
      return [];
    }

    // Remove square brackets if they exist
    stringList = stringList.replace(/\[|\]/g, "");

    // Split the string by commas and trim each element
    const list = stringList.split(",").map((item) => item.replace(/'/g, ""));

    return list;
  },
};