const express = require("express");
const registerRoutes = require("./registerRoutes");
const registerMiddlewares = require("./registerMiddlewares");
const { registerSocket, deregisterAllSockets } = require("./registerSocket");
const connect = require("./socket/client");
const registerDatabase = require("../libs/database/registerDatabase");
const { v4: uuidv4 } = require("uuid");
const redis = require("redis");

//  create redis client and connect to redis server
const redis_url = process.env.REDIS_URL || "redis://127.0.0.1";
const redis_client = redis.createClient(redis_url);

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

function createApp() {
  const app = express();
  registerMiddlewares(app);
  registerRoutes(app);
  return app;
}

function startApp() {
  const app = createApp();

  const server = app.listen(process.env.FILTER_PORT, () => {
    //for the sake of testing, deregister all sockets
    deregisterAllSockets();
    registerDatabase(app, () => {
      registerSocket(server, app);
      connect(process.env.STREAM_SERVICE_URL, app);
      console.log(
        `Server is running on http://localhost:${process.env.FILTER_PORT}`
      );
    });
  });

  // server send uuid to client
  app.get("/getUuid", (req, res, next) => {
    try {
      //create uuid and send back to client
      return res.status(200).send(uuidv4());
    } catch (err) {
      //if error
      return res
        .status(400)
        .send({ message: "Failed to create UUID", error: true });
    }
  });

  //get all data in mongodb
  app.get("/getAllTweets", (req, res, next) => {
    //query
    const uuid = req.query.uuid;

    //redis key
    const redisKey = `redis-${uuid}`;

    //try get data from redis
    return redis_client.get(redisKey, async (err, result) => {
      //if there is result
      if (result) {
        const resultJSON = JSON.parse(result);
        return res.status(200).json(resultJSON);
      } else {
        //else get from mongo
        const data = await app.db.History.find({ clientId: uuid });
        console.log("Start Here!");
        console.log(data);
        console.log("Start Here!");

        redis_client.setex(
          redisKey,
          3600,
          JSON.stringify({ source: "Redis Cache", data })
        );
        return res.status(200).json({ source: "MongoDB", data });
      }
    });
  });
}

startApp();
