import { Connect } from "../connect/connect";
import { SocketContext, socket } from "../../context/socket";
import { Container } from "react-bootstrap";
import "./rawTweets.css";

export function RawTweets(props) {
  return (
    <SocketContext.Provider value={socket}>
      <Container className="header">
        <img src="./Twitter-Logo.png" alt="twitter-logo" />
        <h1>Real Time Tweet Streamer</h1>
        <h4>by Trong Dat Nguyen & Quoc Huy Nguyen</h4>
      </Container>
      <Container className="tweets-content">
        <Connect />
      </Container>
    </SocketContext.Provider>
  );
}
