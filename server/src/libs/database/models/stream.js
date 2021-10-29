const mongoose = require("mongoose");

const StreamSchema = mongoose.Schema({
  clientId: String,
  rules: Array,
});

const StreamModel = mongoose.model("stream", StreamSchema);

module.exports = StreamModel;
