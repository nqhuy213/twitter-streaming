const { searchTweets, deleteRules } = require("../libs/api");

//global set
const connections = new Set();

function registerSocket(server, app) {
  const io = require("socket.io")(server);
  console.log("---- Creating Socket Server ----");
  app.io = io;
  app.clientConnectionIds = new Set();
  console.log("---- Socket server created ----");
  io.on("connection", (socket) => {
    // deregisterAllSockets();
    connections.add(socket);
    app.clientConnectionIds.add(socket.id);
    console.log(`Socket ${socket.id} connected.`);
    try {
      socket.on("streaming", async (keywords) => {
        /** Store socket and keywords in db */
        console.log(keywords);
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
          if (deletedStream !== null) {
            deleteRules(deletedStream.rules)
              .then((res) => {
                console.log(`To delete ${deletedStream.socketId}`);

                /** Delete rules in Twitter */

                console.log(`Socket ${socket.id} disconnected`);
              })
              .catch((err) => console.log(err));
          }
        });
      });
      socket.on("deleteRules", async function () {
        /** Delete in database */
        app.db.Stream.findOne({
          socketId: socket.id,
        })
          .then((stream) => {
            if (stream.rules !== []) {
              deleteRules(stream.rules).then((res) => {
                if (!res.message) {
                  console.log("Delete rules!");
                }
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
}

function deregisterAllSockets() {
  if (connections.size > 0) {
    console.log("---- Deregister all sockets ----");
    for (const socket of connections) {
      socket.disconnect();

      connections.delete(socket);
    }
  }
}

module.exports = { registerSocket, deregisterAllSockets };
