"use strict";

var Controller = require("../controller");

var path = require("path");

function registerRoutes(app) {
  var ctrl = new Controller(app);
  app.post("/api/search", ctrl.searchTweets);
  app.post("/api/stream-rules", ctrl.addStreamRules);
  app.get("/api/stream-rules", ctrl.getStreamRules);
  app["delete"]("/api/stream-rules", ctrl.deleteStreamRules);
  /** User id */

  app.get("/getUuid", ctrl.getUserId);
  /** Get history rules data */

  app.get("/getAllRules", ctrl.getAllRules);
  /** Get history data */

  app.get("/getTweets", ctrl.getTweets);
  /** Any routes that don't match on our static assets or api should be sent to the React Application
   * This allows for the use of things like React Router */

  app.use(function (req, res) {
    res.sendFile(path.join(__dirname, "../../../../react-client/build", "index.html"));
  });
}

module.exports = registerRoutes;
//# sourceMappingURL=registerRoutes.js.map