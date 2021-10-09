const io = require("socket.io-client");
const naturalAnalyseText = require("../analysis/naturalAnalysis");

function registerStreamService(url, app) {
  const socket = io(url);
  socket.on("connect", () => {
    console.log("Stream socket connected");
  });
  socket.on("data", async (data) => {
    /** Handle incoming tweet */
    const matchingRules = data.matching_rules.map((r) => r.id);
    /** Query database stream that has matching rules */
    const allStream = await app.db.Stream.find({
      socketId: { $in: [...app.clientConnectionIds] },
    });

    for (const stream of allStream) {
      for (const streamRule of stream.rules) {
        if (matchingRules.includes(streamRule.id)) {
          /** Natural analysis is here */
          /** Send data to that streaming client socket */
          // let sentimentData = await naturalAnalyseText(data.data.text);

          /** Save historical data into database */
          await naturalAnalyseText(data.data.text).then((sentimentData) => {
            const sentiment = {
              tweetId: data.data.id,
              sentimentData: sentimentData,
              createdTime: new Date(data.data.created_at).getTime(),
            };
            /** Updating history data in database */
            app.db.History.updateOne(
              {
                clientId: stream.clientId,
                rules: {
                  $all: stream.rules.map((rule) => rule.value),
                  $size: stream.rules.length,
                },
              },
              { $push: { data: sentiment } }
            ).then(() => {
              app.io
                .to(stream.socketId)
                .emit("data", { data: data, sentiment: sentiment });
            });
            // const sentiment = {
            //   tweetId: data.data.id,
            //   sentimentData: sentimentData,
            //   createdTime: new Date(data.data.created_at).getTime(),
            // };
            // /** Updating history data in database */
            // app.db.History.updateOne(
            //   {
            //     clientId: stream.clientId,
            //     rules: {
            //       $all: stream.rules.map((rule) => rule.value),
            //       $size: stream.rules.length,
            //     },
            //   },
            //   { $push: { data: sentiment } }
            // ).then(() => {
            //   app.io
            //     .to(stream.socketId)
            //     .emit("data", { data: data, sentiment: sentiment });
            // app.io.to(stream.socketId).emit("sentimentData", sentiment);
          });
          break;
        }
      }
    }
  });
  socket.on("disconnect", (reason) => {
    console.log("Disconnected from Stream service.");
  });
}

module.exports = registerStreamService;
