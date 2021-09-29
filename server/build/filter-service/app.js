"use strict";

var express = require("express");

var registerRoutes = require("./registerRoutes");

var registerMiddlewares = require("./registerMiddlewares");

var registerSocket = require("./registerSocket");

var io = require("socket.io-client");

var connect = require("./socket/client");

var registerDatabase = require("../libs/database/registerDatabase");

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

function createApp() {
  var app = express();
  registerMiddlewares(app);
  registerRoutes(app);
  registerDatabase(app);
  return app;
}

function startApp() {
  var app = createApp();
  var server = app.listen(process.env.FILTER_PORT, function () {
    registerSocket(server, app);
    connect(process.env.STREAM_SERVICE_URL, app);
    console.log("Server is running on http://localhost:".concat(process.env.FILTER_PORT));
  });
}

startApp();
//# sourceMappingURL=app.js.map