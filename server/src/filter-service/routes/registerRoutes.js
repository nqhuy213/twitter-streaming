const Controller = require("../controller");
const path = require("path");

function registerRoutes(app) {
  const ctrl = new Controller(app);

  /** Search all the tweets with rules. Example request body: {clientId: 1, rules: ["dog", "cat"]}*/
  app.post("/api/search", ctrl.searchTweets);
  /** Add rules to Twitter. Example request body: {clientId: 1, rules: ["dog", "cat"]} */
  app.post("/api/stream-rules", ctrl.addStreamRules);
  /** Delete rules in Twitter. Example request body: {clientId: 1, rules: [{value: "dog lang:en"}, {value: "cat lang:en"}]} */
  app.delete("/api/delete-rules", ctrl.deleteStreamRules);
  /** See all rules in Twitter */
  app.get("/api/stream-rules", ctrl.getStreamRules);

  /** User id */
  app.get("/getUuid", ctrl.getUserId);
  /** Get history rules data */
  app.get("/getAllRules", ctrl.getAllRules);
  /** Get history data */
  app.get("/getTweets", ctrl.getTweets);

  //post data

  /** Any routes that don't match on our static assets or api should be sent to the React Application
   * This allows for the use of things like React Router */
  app.use((req, res) => {
    res.sendFile(
      path.join(__dirname, "../../../../react-client/build", "index.html")
    );
  });
}

module.exports = registerRoutes;
