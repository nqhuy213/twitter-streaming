const Controller = require("./controller");

function registerRoutes(app) {
  const ctrl = new Controller(app);
  app.post("/api/search", ctrl.searchTweets);
  app.post("/api/stream-rules", ctrl.addStreamRules);
  app.get("/api/stream-rules", ctrl.getStreamRules);
  app.delete("/api/stream-rules", ctrl.deleteStreamRules);
}

module.exports = registerRoutes;