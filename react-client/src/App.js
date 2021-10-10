import "./App.css";
import { useState, useContext } from "react";
import { RawTweets } from "./component/rawTweets/rawTweets";
import { Container, Tab, Tabs } from "react-bootstrap";
import History from "./component/history/history";
import { UuidContext } from "./uuid/uuid";
function App() {
  const [key, setKey] = useState("streaming");
  const { uuid, uuidError } = useContext(UuidContext);
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
          <Tab eventKey="streaming" title="Streaming">
            <RawTweets />
          </Tab>
          <Tab eventKey="history" title="History">
            {uuid ? <History /> : null}
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

export default App;
