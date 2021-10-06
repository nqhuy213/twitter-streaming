const needle = require("needle");

// const twitterStreamUrl =
//   "https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics";

const twitterStreamUrl =
  "https://api.twitter.com/2/tweets/search/stream?&&tweet.fields=created_at";

function registerStream(app) {
  const stream = needle.get(twitterStreamUrl, {
    headers: { Authorization: `Bearer ${process.env.TWITTER_TOKEN}` },
    timeout: 20000,
  });
  app.stream = stream;
  console.log("---- Stream Registered ----");
  stream
    .on("data", (data) => {
      /** Emit the raw Tweets data to all socket clients */
      try {
        const tweet = JSON.parse(data);
        console.log(tweet);
        // console.log(tweet.includes.users[0]);
        app.io.emit("data", tweet);
      } catch (error) {}
    })
    .on("end", () => {
      console.log("end");
    })
    .on("error", (error) => {
      console.log(error);
      if (error.code === "ETIMEDOUT") {
        stream.emit("timeout");
      }
    });
}

module.exports = registerStream;
