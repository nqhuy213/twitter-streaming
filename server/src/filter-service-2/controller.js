const {
  searchTweets,
  getRules,
  deleteRules,
  addRules,
} = require("../libs/api");
const { successResponse, errorResponse } = require("../libs/utils");

class Controller {
  constructor(app) {
    this.app = app;
  }

  searchTweets = async (req, res, next) => {
    try {
      const { keywords, socket } = req.body;
      // console.log(keywords);
      const ownRules = await searchTweets(keywords);

      /** Store the socket with the specific rules */
      const newStream = new this.app.db.Stream({ socket, rules: ownRules });
      await newStream.save();
      successResponse(res, { ownRules });
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  };

  getStreamRules = async (req, res, next) => {
    try {
      const rules = await getRules();
      successResponse(res, { results: rules.data ? rules.data : [] });
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  };

  addStreamRules = async (req, res, next) => {
    try {
      const { rules } = req.body;
      const response = addRules(rules);
      successResponse(res, { add: response });
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  };

  deleteStreamRules = async (req, res, next) => {
    try {
      const { rules } = req.body;
      const response = await deleteRules(rules);
      successResponse(res, { deleted: response });
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  };
}

module.exports = Controller;
