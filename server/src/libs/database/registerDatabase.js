const mongoose = require("mongoose");
const StreamModel = require("./models/stream");

function createDatabase() {
  return {
    Stream: StreamModel,
  };
}

function registerDatabase(app, cb) {
  console.log("---- Connecting Database ----");
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("---- MongoDb Connected ----");
      const db = createDatabase();
      app.db = db;
      cb();
    })
    .catch((err) => {
      console.log(err.message);
      throw err;
    });
}

module.exports = registerDatabase;
