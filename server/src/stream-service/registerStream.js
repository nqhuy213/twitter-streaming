const needle = require("needle");

// const twitterStreamUrl =
//   "https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics";

const twitterStreamUrl =
  "https://api.twitter.com/2/tweets/search/stream?&&tweet.fields=created_at";

function registerStream(app) {
  console.log(process.env.TWITTER_TOKEN);
  const stream = needle.get(twitterStreamUrl, {
    headers: {
      Authorization:
        "Bearer AAAAAAAAAAAAAAAAAAAAAAEUTAEAAAAA25iMRaSMSxgh4UiSo2BU%2Byw5d1g%3DZUGuRgRZFefXjVEQ021g5k0mNlQJ1QeRCfn7FWQDOBjREp1VaC",
    },
  });
  console.log(stream);
  app.stream = stream;
  console.log("---- Stream Registered ----");
  stream
    .on("data", (data) => {
      /** Emit the raw Tweets data to all socket clients */
      try {
        const tweet = JSON.parse(data);
        console.log(tweet);
        app.io.emit("data", tweet);
      } catch (error) {}
    })
    .on("end", (e) => {
      console.log("end");
    })
    .on("error", (error) => {
      if (error.code === "ETIMEDOUT") {
        stream.emit("timeout");
      }
    });
}

module.exports = registerStream;
