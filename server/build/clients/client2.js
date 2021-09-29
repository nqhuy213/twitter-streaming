"use strict";

var io = require("socket.io-client");

var url = "http://localhost:3001";
var socket = io(url);
var keywords = ["dog", "cat"];
socket.emit("streaming", keywords);
socket.on("data", function (data) {
  console.log(data);
});
//# sourceMappingURL=client2.js.map