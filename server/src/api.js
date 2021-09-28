const axios = require("axios").default;
const twitterStreamUrl = "https://api.twitter.com/2/tweets/search/stream";
const twitterStreamRules =
  "https://api.twitter.com/2/tweets/search/stream/rules";

require("dotenv").config();

const r = [{ value: "dog" }];

module.exports.searchTweets = async (keywords) => {};

const addRules = async (rules) => {
  try {
    const body = { add: rules };
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

const deleteRules = async (rules) => {
  const ids = rules.data.map((rule) => rule.id);
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

(async () => {
  const rules = await deleteRules({
    data: [{ id: "1442800133201018881", value: "dog" }],
    meta: { sent: "2021-09-28T10:35:57.608Z", result_count: 1 },
  });
  console.log(rules);
})();
