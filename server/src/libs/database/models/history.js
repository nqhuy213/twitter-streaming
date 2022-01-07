const mongoose = require("mongoose");

const HistorySchema = mongoose.Schema({
  clientId: String,
  rules: Array,
  data: Array,
});

const HistoryModel = mongoose.model("history", HistorySchema);

module.exports = HistoryModel;
