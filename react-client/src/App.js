import "./App.css";
import { RawTweets } from "./component/rawTweets/rawTweets";
import { Container, Nav } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import D3Chart from "./component/d3chart/d3chart";
// import { SocketContext } from "./context/socket";
// import { useReducer } from "react";
// import socketio from "socket.io-client";

// const reducer = (state, pair) => ({ ...state, ...pair });

// const url = "http://localhost:3001";
// const initSocket = socketio(url);

function App() {
  // const [socket, update] = useReducer(reducer, initSocket);
  return (
    <div className="App">
      <Container className="header">
        <img src="./Twitter-Logo.png" alt="twitter-logo" />
        <h1>Real Time Tweet Streamer</h1>
        <h4>by Trong Dat Nguyen & Quoc Huy Nguyen</h4>

        <Nav variant="pills">
          <Nav.Item>
            <Nav.Link href="/">Live Tweets</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="chart">Sentiment Charts</Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>

      <Router>
        <Route exact path="/" component={RawTweets} />
        <Route exact path="/chart" component={D3Chart} />
      </Router>
    </div>
  );
}

export default App;
