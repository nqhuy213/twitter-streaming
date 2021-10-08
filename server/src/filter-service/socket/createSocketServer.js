const { searchTweets, deleteRules } = require("../../libs/api");
const getRedisKey = require("../redis/getRedisKey");

//global set
const connections = new Set();
/** Socket to handle incoming connections from clients.
 * Create a socket server that receive streaming event
 * from clients and handle logic.
 */
function createSocketServer(server, app) {
  const io = require("socket.io")(server);
  console.log("---- Creating Socket Server ----");
  app.io = io;
  app.clientConnectionIds = new Set();
  console.log("---- Socket server created ----");
  io.on("connection", (socket) => {
    connections.add(socket);
    app.clientConnectionIds.add(socket.id);
    console.log(`Socket ${socket.id} connected.`);
    /** Send client ID along with the keywords */
    socket.on("streaming", async ({ clientId, keywords }) => {
      /** Flush all history from the redis client */
      app.redisClient.del(getRedisKey(clientId), (err, response) => {
        if (response === 1) {
          console.log(`Delete key ${getRedisKey(clientId)}`);
        } else {
          console.log(`Cannot delete redis key`);
        }
      });
      /** Store socket and keywords in db */
      const ownRules = await searchTweets(keywords);
      const Stream = app.db.Stream;
      const newStream = new Stream({
        socketId: socket.id,
        rules: ownRules,
        clientId: clientId,
      });
      await newStream.save();

      /** Store the client Id with its rules in the History Model */
      const history = await app.db.History.findOne({
        clientId: clientId,
        rules: keywords.map((keyword) => keyword + " lang:en"),
      });
      /** Already exists in the database*/
      if (history) {
        history.rules = [
          ...new Set([
            ...history.rules,
            ...keywords.map((keyword) => keyword + " lang:en"),
          ]),
        ];
        await history.save();
      } else {
        /** Not exists, create new one */
        const newHistory = new app.db.History({
          clientId: clientId,
          rules: keywords.map((keyword) => keyword + " lang:en"),
        });
        await newHistory.save();
      }
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

module.exports = { createSocketServer, deregisterAllSockets };
