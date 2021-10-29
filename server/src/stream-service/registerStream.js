const needle = require("needle");

// const twitterStreamUrl =
//   "https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics";

const twitterStreamUrl =
  "https://api.twitter.com/2/tweets/search/stream?&&tweet.fields=created_at";

function registerStream(app) {
  console.log(process.env.TWITTER_BEARER_TOKEN);
  const stream = needle.get(twitterStreamUrl, {
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    },
  });
  app.stream = stream;
  console.log("---- Stream Registered ----");
  let nextSocket = 0;
  stream
    .on("data", (data) => {
      /** Emit the raw Tweets data to all socket clients */
      try {
        console.log(`Socket index to send: ${nextSocket}`);
        const tweet = JSON.parse(data);
        app.io.to(app.connections[nextSocket].id).emit("data", tweet);
        nextSocket =
          nextSocket + 1 === app.connections.length ? 0 : nextSocket + 1;
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
