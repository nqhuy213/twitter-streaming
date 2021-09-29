const io = require("socket.io-client");
function connectToServer(url, app) {
  const socket = io(url);
  socket.on("connect", () => {
    console.log("Stream socket connected");
  });
  socket.on("data", async (data) => {
    /** Handle incoming tweet */
    const matchingRules = data.matching_rules;
    /** Query database stream that has matching rules */
    const allStream = await app.db.Stream.find({
      socketId: { $in: [...app.clientConnectionIds] },
    });
    // console.log(allStream);
    for (const stream of allStream) {
      for (const streamRule of stream.rules) {
        for (const matchingRule of matchingRules) {
          if (streamRule.id === matchingRule.id) {
            /** Send data to that streaming client socket */
            app.io.to(stream.socketId).emit("data", data);
            continue;
          }
        }
      }
    }
  });
  socket.on("disconnect", () => {
    console.log("Disconnected from Stream service.");
  });
}

module.exports = connectToServer;
