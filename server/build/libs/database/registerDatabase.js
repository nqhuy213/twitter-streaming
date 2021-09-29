"use strict";

var mongoose = require("mongoose");

var StreamModel = require("./models/stream");

function createDatabase() {
  return {
    Stream: StreamModel
  };
}

function registerDatabase(app) {
  console.log("---- Connecting Database ----");
  mongoose.connect(process.env.MONGODB_URI).then(function () {
    console.log("---- MongoDb Connected ----");
    var db = createDatabase();
    app.db = db;
  })["catch"](function (err) {
    console.log(err.message);
    throw err;
  });
}

module.exports = registerDatabase;
//# sourceMappingURL=registerDatabase.js.map