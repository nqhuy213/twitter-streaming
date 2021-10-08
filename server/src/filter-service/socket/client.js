const io = require("socket.io-client");
const naturalAnalyseText = require("../analysis/naturalAnalysis");

//redis
var redis = require("redis");
require("redis-streams")(redis);

var redisClient = redis.createClient();

//connect to the server
function connectToServer(url, app) {
  console.log(url);
  const socket = io(url);
  socket.on("connect", () => {
    console.log("Stream socket connected");
  });
  socket.on("data", async (data) => {
    /** Handle incoming tweet */
    // console.log(data);
    const matchingRules = data.matching_rules.map((r) => r.id);
    /** Query database stream that has matching rules */
    const allStream = await app.db.Stream.find({
      socketId: { $in: [...app.clientConnectionIds] },
    });

    // print all streams
    // console.log(allStream);
    for (const stream of allStream) {
      for (const streamRule of stream.rules) {
        if (matchingRules.includes(streamRule.id)) {
          /** Natural analysis is here */

          /** Send data to that streaming client socket */
          // console.log(streamRule);
          // console.log(data.data.text);
          let sentimentData = await naturalAnalyseText(data.data.text);
          // console.log(sentimentData);

          /** Store stream data in redis */
          // Publish it
          // redis.publish("tweets", JSON.stringify(data));

          // Persist it to a Redis list
          // redis.sadd("stream:tweets", JSON.stringify(data));

          /** Redis stream */
          // redisClient.xadd(
          //   "example",
          //   "MAXLEN",
          //   1000000,
          //   "*",
          //   "rawTweet",
          //   JSON.stringify(data.data)
          // );
          // console.log("hello");
          // // Get tweet
          // redis.lrange("stream:tweets", 0, -1, function (err, tweets) {
          //   if (err) {
          //     console.log(err);
          //   } else {
          //     // Get tweets
          //     let tweet_list = [];
          //     tweets.forEach(function (tweet, i) {
          //       tweet_list.push(JSON.parse(tweet));
          //     });
          //     app.io.to(stream.socketId).emit("redisData", tweet_list);
          //   }
          // });
          // console.log(data);

          console.log(stream);
          app.io.to(stream.socketId).emit("data", data);
          /** Save historical data into database */
          const sentiment = {
            tweetId: data.data.id,
            sentimentData: sentimentData,
            createdTime: new Date(data.data.created_at).getTime(),
          };
          await app.db.History.updateOne(
            {
              clientId: stream.clientId,
              rules: stream.rules.map((rule) => rule.value),
            },
            { $push: { data: sentiment } }
          );

          app.io.to(stream.socketId).emit("sentimentData", sentiment);
          break;
        }
      }
    }
  });
  socket.on("disconnect", (reason) => {
    console.log("Disconnected from Stream service.");
  });
}

module.exports = connectToServer;
