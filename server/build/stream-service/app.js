"use strict";

var express = require("express");

var registerStream = require("./registerStream");

var registerSocket = require("./registerSocket");

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

function createApp() {
  var app = express();
  return app;
}

function startApp() {
  var app = createApp();
  var server = app.listen(process.env.STREAM_PORT, function () {
    console.log("Server is running on http://localhost:".concat(process.env.STREAM_PORT));
  });
  registerSocket(server, app);
  registerStream(app);
}

startApp();
//# sourceMappingURL=app.js.map