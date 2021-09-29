const io = require("socket.io-client");
function connectToServer(url, app) {
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
    // console.log(allStream);
    for (const stream of allStream) {
      for (const streamRule of stream.rules) {
        if (matchingRules.includes(streamRule.id)) {
          /** Send data to that streaming client socket */
          app.io.to(stream.socketId).emit("data", data);
          break;
        }
      }
    }
  });
  socket.on("disconnect", () => {
    console.log("Disconnected from Stream service.");
  });
}

module.exports = connectToServer;
