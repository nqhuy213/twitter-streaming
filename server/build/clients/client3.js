"use strict";

var io = require("socket.io-client");

var url = "http://localhost:3002";
var socket = io(url);
var keywords = ["cat", "superman"];
socket.emit("streaming", keywords);
socket.on("data", function (data) {
  console.log(data);
});
//# sourceMappingURL=client3.js.map