const { getRules, addRules } = require("../libs/api");
const registerDatabase = require("../libs/database/registerDatabase");

require("dotenv").config();

function run() {
  const app = {};
  registerDatabase(app);
  const worker = setInterval(async () => {
    /** Query database */
    const allStream = await app.db.Stream.find({});
    /** Query Twitter rules */
    let allRules = await getRules();
    allRules = allRules.data ? allRules.data.map((r) => r.value) : [];
    let missingRules = [];

    for (const stream of allStream) {
      for (const rule of stream.rules) {
        if (!allRules.includes(rule.value)) {
          missingRules.push({ value: rule.value });
        }
      }
    }
    const added = await addRules(missingRules);
    console.log(missingRules);
  }, 2000);
}

run();
