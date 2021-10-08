import "./App.css";
import { useState } from "react";
import { RawTweets } from "./component/rawTweets/rawTweets";
import { Container, Tab, Tabs } from "react-bootstrap";
import D3Chart from "./component/d3chart/d3chart";

function App() {
  const [key, setKey] = useState("raw-tweets");

  return (
    <div className="App">
      {/* <UuidContext.Provider value={{ uuid: uuid, error: error }}> */}
      <Container className="header">
        <img src="./Twitter-Logo.png" alt="twitter-logo" />
        <h1>Real Time Tweet Streamer</h1>
        <h4>by Trong Dat Nguyen & Quoc Huy Nguyen</h4>

        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
        >
          <Tab eventKey="raw-tweets" title="Raw Tweets">
            <RawTweets />
          </Tab>
          <Tab eventKey="sen-chart" title="Profile">
            <D3Chart />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

export default App;
