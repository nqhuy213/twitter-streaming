const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const path = require("path");
function registerMiddlerwares(app) {
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cors());
  app.use(
    express.static(path.join(__dirname, "../../../../react-client/build"))
  );
}

module.exports = registerMiddlerwares;
