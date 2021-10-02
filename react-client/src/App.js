import "./App.css";
import { RawTweets } from "./component/rawTweets/rawTweets";
import { Container } from "react-bootstrap";
import { SocketContext } from "./context/socket";
import { useReducer } from "react";
import socketio from "socket.io-client";

const reducer = (state, pair) => ({ ...state, ...pair });

const url = "http://localhost:3001";
const initSocket = socketio(url);

function App() {
  const [socket, update] = useReducer(reducer, initSocket);
  return (
    <div className="App">
      <Container className="header">
        <img src="./Twitter-Logo.png" alt="twitter-logo" />
        <h1>Real Time Tweet Streamer</h1>
        <h4>by Trong Dat Nguyen & Quoc Huy Nguyen</h4>
      </Container>
      <SocketContext.Provider value={{ socket, update }}>
        <RawTweets />
      </SocketContext.Provider>
    </div>
  );
}

export default App;
