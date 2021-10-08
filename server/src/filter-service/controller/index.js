const {
  searchTweets,
  getRules,
  deleteRules,
  addRules,
} = require("../../libs/api");
const { successResponse, errorResponse } = require("../../libs/utils");
const { v4: uuidv4 } = require("uuid");
const getRedisKey = require("../redis/getRedisKey");

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

  //delete rules
  deleteStreamRules = async (req, res, next) => {
    try {
      const { rules } = req.body;
      const response = await deleteRules(rules);
      successResponse(res, { deleted: response });
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  };

  getUserId = (req, res, next) => {
    try {
      //create uuid and send back to client
      return res.status(200).send(uuidv4());
    } catch (err) {
      //if error
      return res
        .status(400)
        .send({ message: "Failed to create UUID", error: true });
    }
  };

  getAllTweets = async (req, res, next) => {
    const uuid = req.query.uuid;
    //redis key
    const redisKey = getRedisKey(uuid);

    //try get data from redis
    return this.app.redisClient.get(redisKey, async (err, result) => {
      //if there is result
      if (result) {
        const resultJSON = JSON.parse(result);
        return res.status(200).json(resultJSON);
      } else {
        //else get from mongo
        const data = await this.app.db.History.find({ clientId: uuid });
        if (data.length > 0) {
          this.app.redisClient.setex(
            redisKey,
            3600,
            JSON.stringify({ source: "Redis Cache", data })
          );
        }
        return res.status(200).json({ source: "MongoDB", data });
      }
    });
  };
}

module.exports = Controller;
