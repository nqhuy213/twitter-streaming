const mongoose = require("mongoose");
const StreamModel = require("./models/stream");

function createDatabase() {
  return {
    Stream: StreamModel,
  };
}

function registerDatabase(app) {
  console.log("---- Connecting Database ----");
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("---- MongoDb Connected ----");
      const db = createDatabase();
      app.db = db;
    })
    .catch((err) => {
      console.log(err.message);
      throw err;
    });
}

module.exports = registerDatabase;
