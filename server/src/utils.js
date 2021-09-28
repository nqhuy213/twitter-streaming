module.exports.successResponse = (res, payload) => {
  res.status(200).json({ success: true, payload });
};

module.exports.errorResponse = (res, code, message) => {
  res.status(code).json({ error: true, message });
};
