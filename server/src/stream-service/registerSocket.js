function registerSocket(server, app) {
  const io = require("socket.io")(server);
  app.io = io;
  const connections = new Set();
  io.on("connection", (socket) => {
    connections.add(socket);
    console.log(socket.id);
    socket.once("disconnect", function () {
      connections.delete(s);
    });
  });
}

module.exports = registerSocket;
