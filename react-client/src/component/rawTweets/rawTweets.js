import { useState, useContext } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import { Tweet } from "react-twitter-widgets";
import "./rawTweets.css";
import socketio from "socket.io-client";
import { UuidContext } from "../../uuid/uuid";

//url
const url = "http://localhost:3001";

export function RawTweets() {
  //states
  const [keywords, setKeywords] = useState([]);
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({ status: false, message: "" });

  //uuid
  const { uuid, uuidError } = useContext(UuidContext);

  const handleChange = (newValue, actionMeta) => {
    // console.log(newValue);
    setKeywords(newValue.map((val) => val.value));
    // console.log(keywords);
  };
  //adding rules
  const handleAdd = () => {
    try {
      const socket = socketio(url);
      setLoading(true);
      setError(false);
      socket.emit("streaming", { clientId: uuid, keywords });
      socket.on("data", (data) => {
        setResponse((prev) => {
          return [...prev, [data.data]];
        });
        socket.on("sentimentData", (data) => {
          console.log(data);
        });
      });
      setTimeout(() => {
        //disconnect socket
        socket.disconnect();
        socket.close();
        setLoading(false);
        return;
      }, 3 * 1000);
    } catch (err) {
      setError(err);
    }
  };

  //clear raw tweets
  const handleClear = () => {
    console.log(response);
    setResponse([]);
  };

  return (
    <Container>
      <Form.Group className="mb-3">
        <Row>
          <Form.Label>Adding Rules</Form.Label>
          <Col className="col-search-rule" md={10}>
            <CreatableSelect isMulti onChange={handleChange} />
          </Col>
          <Col md={1} className="col-btn-add">
            <Button
              className="btn-add btn-sm"
              variant="primary"
              type="submit"
              onClick={handleAdd}
            >
              Start
            </Button>
          </Col>
          <Col md={1} className="col-btn-add">
            <Button
              className="btn-add btn-sm"
              variant="primary"
              type="submit"
              onClick={handleClear}
            >
              Clear Tweets
            </Button>
          </Col>
        </Row>
      </Form.Group>

      {response.map((data) => {
        return (
          <Row className="justify-content-md-center">
            <Col md={{ offset: 3 }}>
              <Tweet className="tweet" tweetId={`${data[0].id}`} />
            </Col>
          </Row>
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
