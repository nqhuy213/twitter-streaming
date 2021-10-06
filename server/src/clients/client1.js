const io = require("socket.io-client");
const url = "http://localhost:3001";

const socket = io(url);
const keywords = ["dog", "cat"];
socket.emit("streaming", { clientId: 1, keywords });
socket.on("data", (data) => {
  console.log(data);
});
socket.on("sentimentData", (data) => {
  console.log(data);
});
