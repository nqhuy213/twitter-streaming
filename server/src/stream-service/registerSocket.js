function registerSocket(server, app) {
  const io = require("socket.io")(server);
  app.io = io;
  const connections = new Set();
  io.on("connection", (socket) => {
    connections.add(socket);
    socket.once("disconnect", function () {
      console.log("Filter service disconnected");
      connections.delete(socket);
    });
  });
}

module.exports = registerSocket;
