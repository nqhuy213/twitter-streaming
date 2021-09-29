"use strict";

module.exports.successResponse = function (res, payload) {
  res.status(200).json({
    success: true,
    payload: payload
  });
};

module.exports.errorResponse = function (res, code, message) {
  res.status(code).json({
    error: true,
    message: message
  });
};

module.exports.rulesConstructor = function (keywords, existRules) {
  var myRules = [];
  var existValue = existRules.map(function (rule) {
    return rule.value;
  });
  /** Add non-existing rules */

  var toAddRules = keywords.reduce(function (filtered, keyword) {
    var toAdded = "".concat(keyword, " lang:en");

    if (!existValue.includes(toAdded)) {
      filtered.push({
        value: toAdded
      });
    } else {
      myRules.push(existRules[existValue.indexOf(toAdded)]);
    }

    return filtered;
  }, []);
  return [toAddRules, myRules];
};
//# sourceMappingURL=utils.js.map