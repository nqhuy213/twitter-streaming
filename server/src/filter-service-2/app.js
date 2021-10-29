const express = require("express");
const registerRoutes = require("./routes/registerRoutes");
const registerMiddlewares = require("./middlewares/registerMiddlewares");
const {
  createSocketServer,
  deregisterAllSockets,
} = require("./socket/createSocketServer");
const registerStreamService = require("./services/registerStreamService");
const registerDatabase = require("../libs/database/registerDatabase");
const registerRedis = require("./redis/registerRedis");
const path = require("path");
if (process.env.NODE_ENV === "development") {
  require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
}

function createApp() {
  const app = express();
  registerMiddlewares(app);
  registerRoutes(app);
  return app;
}

function startApp() {
  const app = createApp();

  const server = app.listen(3002, () => {
    //for the sake of testing, deregister all sockets
    deregisterAllSockets();
    registerDatabase(app, () => {
      registerRedis(app, () => {
        createSocketServer(server, app);
        registerStreamService(process.env.STREAM_SERVICE_URL, app);
        console.log(`Server is running on http://localhost:${3002}`);
      });
    });
  });
}

startApp();
