"use strict";

var express = require("express");

var registerStream = require("./registerStream");

var registerSocket = require("./registerSocket");

var _require = require("../libs/api"),
    deleteAllRules = _require.deleteAllRules;

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

function createApp() {
  var app = express();
  app.get("/", function (req, res) {
    res.send("Stream service is running.");
  });
  return app;
}

function startApp() {
  //for the sake of testing, delete all stream rules in twitter every time the stream restarts
  deleteAllRules(); //init app

  var app = createApp();
  var server = app.listen(process.env.STREAM_PORT, function () {
    console.log("Server is running on http://localhost:".concat(process.env.STREAM_PORT));
  });
  registerSocket(server, app);
  registerStream(app);
}

startApp();
//# sourceMappingURL=app.js.map