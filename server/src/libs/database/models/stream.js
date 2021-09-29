const mongoose = require("mongoose");

const StreamSchema = mongoose.Schema({
  socketId: String,
  rules: Array,
});

const StreamModel = mongoose.model("stream", StreamSchema);

module.exports = StreamModel;
