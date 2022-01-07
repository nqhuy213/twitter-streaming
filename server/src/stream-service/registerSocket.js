function registerSocket(server, app) {
  const io = require("socket.io")(server);
  app.io = io;
  app.connections = [];
  app.nextSocket = 0;
  io.on("connection", (socket) => {
    app.connections.push(socket);
    console.log("Filter service connected");
    socket.once("disconnect", function () {
      console.log("Filter service disconnected");
      deleted = app.connections.filter((s) => s.id !== socket.id);
      app.connections = deleted;
      app.nextSocket = 0;
    });
  });
}

module.exports = registerSocket;
