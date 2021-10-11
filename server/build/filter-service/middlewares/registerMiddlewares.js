"use strict";

var morgan = require("morgan");

var express = require("express");

var cors = require("cors");

var path = require("path");

function registerMiddlerwares(app) {
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cors());
  app.use(express["static"](path.join(__dirname, "../../../../react-client/build")));
}

module.exports = registerMiddlerwares;
//# sourceMappingURL=registerMiddlewares.js.map