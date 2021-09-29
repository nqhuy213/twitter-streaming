const express = require("express");
const registerRoutes = require("./registerRoutes");
const registerMiddlewares = require("./registerMiddlewares");
const registerSocket = require("./registerSocket");
const io = require("socket.io-client");
const connect = require("./socket/client");
const registerDatabase = require("../libs/database/registerDatabase");

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

function createApp() {
  const app = express();
  registerMiddlewares(app);
  registerRoutes(app);
  registerDatabase(app);
  return app;
}

function startApp() {
  const app = createApp();
  const server = app.listen(process.env.FILTER_PORT, () => {
    console.log(
      `Server is running on http://localhost:${process.env.FILTER_PORT}`
    );
  });

  registerSocket(server, app);
  connect(process.env.STREAM_SERVICE_URL, app);
}

startApp();
