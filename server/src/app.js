const express = require("express");
const path = require("path");
const registerRoutes = require("./registerRoutes");
const registerMiddlewares = require("./registerMiddlewares");

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
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  });
}

startApp();
