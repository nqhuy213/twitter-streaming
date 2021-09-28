const controller = require("./controller");
function registerRoutes(app) {
  app.get("/api/search", controller.searchTweets);
}

module.exports = registerRoutes;
