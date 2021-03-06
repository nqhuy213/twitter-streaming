const express = require("express");
const registerStream = require("./registerStream");
const registerSocket = require("./registerSocket");
const { deleteAllRules } = require("../libs/api");

const path = require("path");
if (process.env.NODE_ENV === "development") {
  require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
}

function createApp() {
  const app = express();
  app.get("/", (req, res) => {
    res.send("Stream service is running.");
  });
  return app;
}

function startApp() {
  //for the sake of testing, delete all stream rules in twitter every time the stream restarts
  deleteAllRules();

  //init app
  const app = createApp();
  const server = app.listen(process.env.STREAM_PORT, () => {
    console.log(
      `Server is running on http://localhost:${process.env.STREAM_PORT}`
    );
  });
  registerSocket(server, app);
  registerStream(app);
}

startApp();
