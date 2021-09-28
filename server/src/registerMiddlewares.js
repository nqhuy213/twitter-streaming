const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
function registerMiddlerwares(app) {
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cors());
}

module.exports = registerMiddlerwares;
