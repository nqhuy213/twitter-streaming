"use strict";

var morgan = require("morgan");

var express = require("express");

var cors = require("cors");

function registerMiddlerwares(app) {
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cors());
}

module.exports = registerMiddlerwares;
//# sourceMappingURL=registerMiddlewares.js.map