const needle = require("needle");

const twitterStreamUrl =
  "https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics";

function registerStream(app) {
  const stream = needle.get(twitterStreamUrl, {
    headers: { Authorization: `Bearer ${process.env.TWITTER_TOKEN}` },
  });
  app.stream = stream;
  console.log("---- Stream Registered ----");
  stream
    .on("data", (data) => {
      /** Emit the raw Tweets data to all socket clients */
      const tweet = JSON.parse(data);
      app.io.emit("data", tweet);
    })
    .on("end", () => {
      console.log("end");
    });
}

module.exports = registerStream;
