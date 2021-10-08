const express = require("express");
const registerRoutes = require("./registerRoutes");
const registerMiddlewares = require("./registerMiddlewares");
const {
  createSocketServer,
  deregisterAllSockets,
} = require("./createSocketServer");
const registerStreamService = require("./registerStreamService");
const registerDatabase = require("../libs/database/registerDatabase");
const registerRedis = require("./registerRedis");

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

function createApp() {
  const app = express();
  registerMiddlewares(app);
  registerRoutes(app);
  return app;
}

function startApp() {
  const app = createApp();

  const server = app.listen(process.env.FILTER_PORT, () => {
    //for the sake of testing, deregister all sockets
    deregisterAllSockets();
    registerDatabase(app, () => {
      registerRedis(app, () => {
        createSocketServer(server, app);
        registerStreamService(process.env.STREAM_SERVICE_URL, app);
        console.log(
          `Server is running on http://localhost:${process.env.FILTER_PORT}`
        );
      });
    });
  });
}

startApp();
