"use strict";

var mongoose = require("mongoose");

var StreamSchema = mongoose.Schema({
  socketId: String,
  clientId: String,
  rules: Array
});
var StreamModel = mongoose.model("stream", StreamSchema);
module.exports = StreamModel;
//# sourceMappingURL=stream.js.map