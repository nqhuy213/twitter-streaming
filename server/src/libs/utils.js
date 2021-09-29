module.exports.successResponse = (res, payload) => {
  res.status(200).json({ success: true, payload });
};

module.exports.errorResponse = (res, code, message) => {
  res.status(code).json({ error: true, message });
};

module.exports.rulesConstructor = (keywords, existRules) => {
  let myRules = [];
  const existValue = existRules.map((rule) => rule.value);

  /** Add non-existing rules */
  const toAddRules = keywords.reduce((filtered, keyword) => {
    const toAdded = `${keyword} lang:en`;
    if (!existValue.includes(toAdded)) {
      filtered.push({ value: toAdded });
    } else {
      myRules.push(existRules[existValue.indexOf(toAdded)]);
    }
    return filtered;
  }, []);

  return [toAddRules, myRules];
};
