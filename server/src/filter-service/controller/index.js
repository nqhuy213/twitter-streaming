const {
  getMyOwnRules,
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
      const { clientId, rules } = req.body;
      const fixedRules = rules.map((rule) => rule + " lang:en");
      const result = await this.app.db.History.findOne({
        clientId: clientId,
        rules: fixedRules,
      });
      successResponse(res, { result });
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
      const { clientId, rules } = req.body;
      const ownRules = await getMyOwnRules(rules);
      /** Delete existing Redis key */
      const redisKey = getRedisKey(
        clientId + "-" + rules.map((rule) => rule + " lang:en").join(",")
      );
      console.log(redisKey);
      this.app.redisClient.get(redisKey, async (err, result) => {
        //if there is result
        if (result) {
          console.log(`Redis key ${redisKey} deleted`);
          this.app.redisClient.del(redisKey);
        }
      });
      /** Add into the stream and history in database */
      const history = await this.app.db.History.findOne({
        clientId: clientId,
        rules: rules.map((keyword) => keyword + " lang:en"),
      });
      /** Already exists in the database*/
      if (!history) {
        /** Not exists, create new one */
        const newHistory = new this.app.db.History({
          clientId: clientId,
          rules: rules.map((keyword) => keyword + " lang:en"),
        });
        await newHistory.save();
      }

      /** Add into the stream collection */
      const Stream = this.app.db.Stream;
      const newStream = new Stream({
        rules: ownRules,
        clientId: clientId,
      });
      await newStream.save();

      successResponse(res, { add: ownRules });
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  };

  //delete rules
  deleteStreamRules = async (req, res, next) => {
    try {
      const { clientId, rules } = req.body;
      console.log(rules);
      await this.app.db.Stream.deleteOne({ clientId: clientId });
      const remainingStreams = await this.app.db.Stream.find({
        clientId: { $ne: clientId },
      });
      // console.log("deleted");
      // console.log(rules);
      let remainingRules = [];
      remainingStreams.map((stream) =>
        stream.rules.map((rule) => remainingRules.push(rule.value))
      );
      let toDeleteRules = rules.filter(
        (rule) => !remainingRules.includes(rule.value)
      );
      console.log(toDeleteRules);
      const response = await deleteRules(toDeleteRules);
      /** Delete client in the stream collection */

      successResponse(res, { deleted: response });
    } catch (error) {
      console.log(error);
      errorResponse(res, 500, error.message);
    }
  };

  getUserId = (req, res, next) => {
    try {
      //create uuid and send back to client
      // return res.status(200).send(uuidv4());
      successResponse(res, { uuid: uuidv4() });
    } catch (err) {
      //if error
      // return res
      //   .status(400)
      //   .send({ message: "Failed to create UUID", error: true });
      errorResponse(res, 400, err.message);
    }
  };

  getAllRules = async (req, res, next) => {
    const uuid = req.query.uuid;
    // //redis key
    // const redisKey = getRedisKey(uuid);

    // //try get data from redis
    // return this.app.redisClient.get(redisKey, async (err, result) => {
    //   //if there is result
    //   if (result) {
    //     const resultJSON = JSON.parse(result);
    //     return res.status(200).json(resultJSON);
    // } else {
    //else get from mongo
    const data = await this.app.db.History.find({ clientId: uuid });
    if (data.length > 0) {
      //   this.app.redisClient.setex(
      //     redisKey,
      //     3600,
      //     JSON.stringify({
      //       source: "Redis Cache",
      //       clientId: data[0].clientId,
      //       rules: data.map((data) => ({
      //         label: data.rules.map((data) => data.replace(" lang:en", " ")),
      //         value: data.rules,
      //       })),
      //     })
      //   );
      return res.status(200).json({
        source: "MongoDB",
        clientId: data[0].clientId,
        rules: data.map((data) => ({
          label: data.rules.map((data) => data.replace(" lang:en", " ")),
          value: data.rules,
        })),
      });
    } else {
      res.status(200).json({
        source: null,
        rules: [],
      });
    }
    // }
    // });
  };

  getTweets = async (req, res, next) => {
    //uuid
    const uuid = req.query.uuid;
    const rules = req.query.rules;
    //redis key
    const redisKey = getRedisKey(`${uuid}-${rules}`);

    //try get data from redis
    return this.app.redisClient.get(redisKey, async (err, result) => {
      //if there is result
      if (result) {
        const resultJSON = JSON.parse(result);
        return res.status(200).json(resultJSON);
      } else {
        //else get from mongo
        const data = await this.app.db.History.find({
          clientId: uuid,
          rules: rules.split(","),
        });
        console.log(data);
        if (data.length > 0) {
          this.app.redisClient.setex(
            redisKey,
            3600,
            JSON.stringify({
              source: "Redis Cache",
              data,
            })
          );
        }
        return res.status(200).json({
          source: "MongoDB",
          data,
        });
      }
    });
  };
}

module.exports = Controller;
