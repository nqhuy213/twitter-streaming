"use strict";

var needle = require("needle");

var twitterStreamUrl = "https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics";

function registerStream(app) {
  var stream = needle.get(twitterStreamUrl, {
    headers: {
      Authorization: "Bearer ".concat(process.env.TWITTER_TOKEN)
    },
    timeout: 20000
  });
  app.stream = stream;
  console.log("---- Stream Registered ----");
  stream.on("data", function (data) {
    /** Emit the raw Tweets data to all socket clients */
    try {
      var tweet = JSON.parse(data); // console.log(tweet);

      app.io.emit("data", tweet);
    } catch (error) {}
  }).on("end", function () {
    console.log("end");
  }).on("error", function (error) {
    console.log(error);

    if (error.code === "ETIMEDOUT") {
      stream.emit("timeout");
    }
  });
}

module.exports = registerStream;
//# sourceMappingURL=registerStream.js.map