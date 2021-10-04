import "./App.css";
import { RawTweets } from "./component/rawTweets/rawTweets";
import { Container } from "react-bootstrap";

const url = "http://localhost:3001";

function App() {
  return (
    <div className="App">
      <Container className="header">
        <img src="./Twitter-Logo.png" alt="twitter-logo" />
        <h1>Real Time Tweet Streamer</h1>
        <h4>by Trong Dat Nguyen & Quoc Huy Nguyen</h4>
      </Container>
      <RawTweets />
    </div>
  );
}

export default App;
