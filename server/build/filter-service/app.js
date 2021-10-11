"use strict";

var express = require("express");

var registerRoutes = require("./routes/registerRoutes");

var registerMiddlewares = require("./middlewares/registerMiddlewares");

var _require = require("./socket/createSocketServer"),
    createSocketServer = _require.createSocketServer,
    deregisterAllSockets = _require.deregisterAllSockets;

var registerStreamService = require("./services/registerStreamService");

var registerDatabase = require("../libs/database/registerDatabase");

var registerRedis = require("./redis/registerRedis");

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

function createApp() {
  var app = express();
  registerMiddlewares(app);
  registerRoutes(app);
  return app;
}

function startApp() {
  var app = createApp();
  var server = app.listen(process.env.FILTER_PORT, function () {
    //for the sake of testing, deregister all sockets
    deregisterAllSockets();
    registerDatabase(app, function () {
      registerRedis(app, function () {
        createSocketServer(server, app);
        registerStreamService(process.env.STREAM_SERVICE_URL, app);
        console.log("Server is running on http://localhost:".concat(process.env.FILTER_PORT));
      });
    });
  });
}

startApp();
//# sourceMappingURL=app.js.map