const redis = require("redis");

//  create redis client and connect to redis server

function registerRedis(app, cb) {
  const redis_client = redis.createClient(process.env.REDIS_URL);
  app.redisClient = redis_client;
  console.log("---- Redis connected ----");
  if (cb) {
    cb();
  }
}

module.exports = registerRedis;
