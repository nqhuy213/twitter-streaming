const { successResponse, errorResponse } = require("./utils");

module.exports.searchTweets = async (req, res, next) => {
  try {
    const keywords = req.query.keywords.split(",");
    console.log(keywords);
    successResponse(res, { hello: "meo" });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};
