"use strict";

var io = require("socket.io-client");

var url = "http://localhost:3002";
var socket = io(url);
var keywords = ["hello", "dead"];
socket.emit("streaming", keywords);
socket.on("data", function (data) {
  console.log(data);
});
//# sourceMappingURL=client4.js.map