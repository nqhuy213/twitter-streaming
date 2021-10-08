const io = require("socket.io-client");
const url = "http://localhost:3001";

const socket = io(url);
const keywords = ["dog", "bear"];
socket.emit("streaming", { clientId: 2, keywords });
socket.on("data", (data) => {
  console.log(data);
});
socket.on("sentimentData", (data) => {
  console.log(data);
});
