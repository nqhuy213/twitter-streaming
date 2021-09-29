const io = require("socket.io-client");
const url = "http://localhost:3002";

const socket = io(url);
const keywords = ["hello", "dead"];
socket.emit("streaming", keywords);
socket.on("data", (data) => {
  console.log(data);
});
