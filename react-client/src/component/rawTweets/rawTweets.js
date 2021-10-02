import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/socket";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Fade, Reveal } from "react-reveal";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
// import socketio from "socket.io-client";
import { Tweet } from "react-twitter-widgets";

import "./rawTweets.css";
import { FetchTweetsRedis } from "../../api/api";

//url
const url = "http://localhost:3001";

export function RawTweets() {
  const [keywords, setKeywords] = useState();

  const { response, loading, error } = FetchTweetsRedis();

  const { socket, update } = useContext(SocketContext);

  //initializing
  // const keywords = ["dog", "bear"];

  const liveStream = (keywords, timeout) => {
    socket.emit("streaming", keywords);
    socket.on("redisData", (data) => {
      console.log(data);
    });
    setInterval(() => {
      socket.disconnect();
      socket.close();
    }, timeout * 1000);
  };

  const handleInput = (e) => {
    // console.log(e.target.value);
    setKeywords(e.target.value);
  };

  const handleAdd = () => {
    //after 3 seconds, kill me
    liveStream(keywords.split(" "), 3);
  };

  useEffect(() => {
    // after 3 seconds, kill me
    // liveStream(3);
    // console.log(socket);
    // liveStream(1);
    // axios({
    //   method: "post",
    //   url: "http://localhost:3001/stream/live",
    //   data: {
    //     keywords: keywords,
    //     timeout: 10,
    //   },
    // })
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));
    // axios.post("http://localhost:3001/getTweet");
    // socket.on("redisData", (data) => {
    //   console.log(data);
    // });
  }, []);

  if (loading === true && error.status === false) {
    return (
      <div class="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  } else if (loading === false && error.status === false) {
    return (
      <Container>
        <Form.Group className="mb-3">
          <Row>
            <Form.Label>Adding Rules</Form.Label>
            <Col className="col-search-rule" md={11}>
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
                {" "}
                Add{" "}
              </Button>
            </Col>
          </Row>
        </Form.Group>
        {response.map((data) => {
          return (
            <Reveal effect="fadeInUp">
              <Row className="justify-content-md-center">
                <Col md={{ offset: 3 }}>
                  <Tweet className="tweet" tweetId={`${data.data.id}`} />
                </Col>
              </Row>
            </Reveal>
          );
        })}
      </Container>
    );
  }
}
