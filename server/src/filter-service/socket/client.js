const io = require("socket.io-client");
function connectToServer(url) {
  const socket = io(url);
  socket.on("connect", () => {
    console.log("Stream socket connected");
  });
  socket.on("data", (data) => {
    /** Handle incoming tweet */
    console.log(data);
  });
}

module.exports = connectToServer;
