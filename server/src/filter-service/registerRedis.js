const redis = require("redis");

//  create redis client and connect to redis server

function registerRedis(app, cb) {
  const redis_url = process.env.REDIS_URL || "redis://127.0.0.1";
  const redis_client = redis.createClient(redis_url);
  app.redisClient = redis_client;
  console.log("---- Redist connected ----");
  if (cb) {
    cb();
  }
}

module.exports = registerRedis;
