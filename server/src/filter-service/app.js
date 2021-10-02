const express = require("express");
const registerRoutes = require("./registerRoutes");
const registerMiddlewares = require("./registerMiddlewares");
const { registerSocket, deregisterAllSockets } = require("./registerSocket");
const connect = require("./socket/client");
const registerDatabase = require("../libs/database/registerDatabase");
const mongoose = require("mongoose");
const io = require("socket.io-client");
const ioserver = require("socket.io");
const { deleteAllRules } = require("../libs/api");

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

const redis = require("redis").createClient();

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

  // app.post("/stream/live", async (req, res, next) => {
  //   //body
  //   const keywords = req.body.keywords;
  //   const timeout = req.body.timeout;
  //   const hostname = `http://${req.headers.host}`;

  //   //save stream in redis
  //   //socket
  //   const socket = io(hostname);
  //   socket.emit("streaming", keywords);
  //   socket.on("data", (data) => {
  //     // console.log(data);

  //     // Publish it
  //     redis.publish("tweets", JSON.stringify(data));

  //     // Persist it to a Redis list
  //     redis.rpush("stream:tweets", JSON.stringify(data));
  //   });
  //   setInterval(() => {
  //     socket.disconnect();
  //     socket.close();
  //   }, timeout * 1000);

  //   res.status(200).send({ message: "ok" });
  // });

  //get the tweets which are already stored in cache
  app.get("/getTweetsCache", (req, res, next) => {
    var BreakException = {};
    // Get tweets from redis
    redis.smembers("stream:tweets", function (err, tweets) {
      if (err) {
        console.log(err);
      } else {
        // Get 10 tweets
        let tweet_list = [];
        try {
          tweets.forEach(function (tweet, i) {
            tweet_list.push(JSON.parse(tweet));
            if (i > 9) {
              throw BreakException;
            }
          });
        } catch (e) {
          if (e !== BreakException) throw e;
        }

        return res.status(200).send(tweet_list);
      }
    });
  });
}

startApp();
