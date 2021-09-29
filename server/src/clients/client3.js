const io = require("socket.io-client");
const url = "http://localhost:3002";

const socket = io(url);
const keywords = ["cat", "superman"];
socket.emit("streaming", keywords);
socket.on("data", (data) => {
  console.log(data);
});
