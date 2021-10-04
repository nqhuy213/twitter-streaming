import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Reveal } from "react-reveal";
// import { PanelGroup, Panel } from "rsuite";

import { Tweet } from "react-twitter-widgets";

import "./rawTweets.css";
// import { FetchTweets } from "../../api/api";

import socketio from "socket.io-client";

const url = "http://localhost:3001";

export function RawTweets() {
  const [keywords, setKeywords] = useState(["cat", "dog"]);
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState({ status: false, message: "" });

  // const [{ response, loading, error }, again, addRules, clear] =
  //   FetchTweets(keywords);
  // const [attempt, setAttempt] = useState(false);

  //handle events
  //rules bar
  const handleInput = (e) => {
    setKeywords(e.target.value);
    // console.log(e.target.value);
  };

  //adding rules
  const handleAdd = () => {
    // addRules(String(keywords).split(" "));
    // setAttempt((prev) => prev++);
    // again(attempt);

    try {
      const socket = socketio(url);
      // console.log(keywords);
      setLoading(true);
      setError(false);
      socket.emit("streaming", keywords);
      socket.on("data", (data) => {
        setResponse((prev) => {
          return [...prev, [data.data]];
        });
      });
      setTimeout(() => {
        // socket.emit("deleteRules", keywords);
        // socket.off("data"); //stop listening

        //disconnect socket
        socket.disconnect();
        socket.close();
        setLoading(false);
        return;
      }, 5 * 1000);
    } catch (err) {
      setError(err);
    }
  };

  //clear raw tweets
  // const handleClear = () => {
  //   clear([]);
  //   addRules([]);
  //   setAttempt((prev) => prev++);
  //   again(attempt);
  // };

  //load more tweets
  // const handleAgain = () => {
  //   //after 3 seconds, kill me
  //   setAttempt((prev) => prev++);
  //   again(attempt);
  // };
  return (
    <Container>
      <Form.Group className="mb-3">
        <Row>
          <Form.Label>Adding Rules</Form.Label>
          <Col className="col-search-rule" md={10}>
            <Form.Control
              type="rules"
              placeholder="Adding rules here"
              onChange={handleInput}
            />
          </Col>
          <Col md={1} className="col-btn-add">
            <Button
              className="btn-add"
              variant="primary"
              type="submit"
              onClick={handleAdd}
            >
              Add
            </Button>
          </Col>
          <Col md={1} className="col-btn-add">
            <Button
              className="btn-add"
              variant="primary"
              type="submit"
              onClick={handleAdd}
            >
              Clear Tweets
            </Button>
          </Col>
        </Row>
      </Form.Group>

      {response.map((data) => {
        return (
          <Reveal effect="fadeInUp">
            <Row className="justify-content-md-center">
              <Col md={{ offset: 3 }}>
                <Tweet className="tweet" tweetId={`${data[0].id}`} />
              </Col>
            </Row>
          </Reveal>
        );
      })}
      {!loading ? (
        <Button
          className="btn-add"
          variant="primary"
          type="submit"
          onClick={handleAdd}
        >
          Load More
        </Button>
      ) : (
        <div className="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
    </Container>
  );

  // return <h1>Hello</h1>;
}
