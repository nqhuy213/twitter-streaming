const express = require("express");
const registerStream = require("./registerStream");
const registerSocket = require("./registerSocket");

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

function createApp() {
  const app = express();
  return app;
}

function startApp() {
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
