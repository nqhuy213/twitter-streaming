"use strict";

var mongoose = require("mongoose");

var StreamModel = require("./models/stream");

var HistoryModel = require("./models/history");

function createDatabase() {
  return {
    Stream: StreamModel,
    History: HistoryModel
  };
}

function registerDatabase(app, cb) {
  console.log("---- Connecting Database ----");
  mongoose.connect(process.env.MONGODB_URI).then(function () {
    console.log("---- MongoDb Connected ----");
    var db = createDatabase();
    app.db = db;

    if (cb) {
      cb();
    }
  })["catch"](function (err) {
    console.log(err.message);
    throw err;
  });
}

module.exports = registerDatabase;
//# sourceMappingURL=registerDatabase.js.map