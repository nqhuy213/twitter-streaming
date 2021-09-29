const axios = require("axios").default;
const needle = require("needle");
const { rulesConstructor } = require("../libs/utils");

const twitterStreamUrl =
  "https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics";
const twitterStreamRules =
  "https://api.twitter.com/2/tweets/search/stream/rules";

const searchTweets = async (keywords) => {
  try {
    let existRules = await getRules();
    existRules = existRules.data ? existRules.data : [];
    /** Add non-existing rules */
    let [toAddRules, myRules] = rulesConstructor(keywords, existRules);
    console.log(toAddRules);
    const ownRules = addRules(toAddRules).then((res) => {
      myRules = [...myRules, ...res.data];
      return myRules;
    });
    return ownRules;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getStream = () => {
  const stream = needle.get(twitterStreamUrl, {
    headers: { Authorization: `Bearer ${process.env.TWITTER_TOKEN}` },
  });

  return stream;
};

const addRules = async (rules) => {
  try {
    if (rules.length > 0) {
      const body = { add: rules };
      const response = await twitterApiCall(
        "POST",
        twitterStreamRules,
        null,
        body
      );
      return response;
    } else {
      return { data: [] };
    }
  } catch (error) {
    throw error;
  }
};

const deleteRules = async (rules) => {
  const ids = rules.map((rule) => rule.id);
  const body = {
    delete: { ids },
  };
  try {
    const response = await twitterApiCall(
      "POST",
      twitterStreamRules,
      null,
      body
    );

    return response;
  } catch (error) {
    throw error;
  }
};

const getRules = async () => {
  try {
    const response = await twitterApiCall("GET", twitterStreamRules);
    return response;
  } catch (error) {
    throw error;
  }
};

const twitterApiCall = async (method = "GET", url, params, body) => {
  var options = {
    method: method,
    url: url,
    params: params,
    data: body,
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_TOKEN}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = { searchTweets, getStream, getRules, deleteRules, addRules };
