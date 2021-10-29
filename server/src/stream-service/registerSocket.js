function registerSocket(server, app) {
  const io = require("socket.io")(server);
  app.io = io;
  app.connections = [];
  io.on("connection", (socket) => {
    app.connections.push(socket);
    console.log("Filter service connected");
    socket.once("disconnect", function () {
      console.log("Filter service disconnected");
      deleted = app.connections.filter((s) => s.id !== socket.id);
      app.connections = deleted;
      console.log(app.connections);
    });
    console.log(app.connections);
  });
}

module.exports = registerSocket;
