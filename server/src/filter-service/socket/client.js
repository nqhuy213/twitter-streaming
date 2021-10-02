const io = require("socket.io-client");
const naturalAnalyseText = require("../analysis/naturalAnalysis");

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
          console.log(sentimentData);
          app.io.to(stream.socketId).emit("data", data);
          app.io.to(stream.socketId).emit("sentimentData", sentimentData);
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
