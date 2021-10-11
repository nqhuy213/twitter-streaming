"use strict";

function registerSocket(server, app) {
  var io = require("socket.io")(server);

  app.io = io;
  var connections = new Set();
  io.on("connection", function (socket) {
    connections.add(socket);
    console.log("Filter service connected");
    socket.once("disconnect", function () {
      console.log("Filter service disconnected");
      connections["delete"](socket);
    });
  });
}

module.exports = registerSocket;
//# sourceMappingURL=registerSocket.js.map