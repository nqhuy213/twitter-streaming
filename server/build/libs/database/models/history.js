"use strict";

var mongoose = require("mongoose");

var HistorySchema = mongoose.Schema({
  clientId: String,
  rules: Array,
  data: Array
});
var HistoryModel = mongoose.model("history", HistorySchema);
module.exports = HistoryModel;
//# sourceMappingURL=history.js.map