const { searchTweets, deleteRules } = require("../libs/api");

function registerSocket(server, app) {
  const io = require("socket.io")(server);
  console.log("---- Connecting Socket ----");
  app.io = io;
  app.clientConnectionIds = new Set();
  const connections = new Set();
  io.on("connection", (socket) => {
    connections.add(socket);
    app.clientConnectionIds.add(socket.id);
    console.log(`Socket ${socket.id} connected.`);
    try {
      socket.on("streaming", async (keywords) => {
        /** Store socket and keywords in db */
        const ownRules = await searchTweets(keywords);
        const Stream = app.db.Stream;
        const newStream = new Stream({ socketId: socket.id, rules: ownRules });
        await newStream.save();
      });

      socket.on("disconnect", async function () {
        connections.delete(socket);
        app.clientConnectionIds.delete(socket.id);
        /** Delete in database */
        app.db.Stream.findOneAndDelete({
          socketId: socket.id,
        }).then((deletedStream) => {
          deleteRules(deletedStream.rules).then((res) => {
            console.log(`To delete ${deletedStream.socketId}`);

            /** Delete rules in Twitter */

            console.log(`Socket ${socket.id} disconnected`);
          });
        });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
}

module.exports = registerSocket;