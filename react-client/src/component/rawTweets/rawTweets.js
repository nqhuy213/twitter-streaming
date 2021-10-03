import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Reveal } from "react-reveal";
import useInfiniteScroll from "react-infinite-scroll-hook";
import InfiniteScroll from "react-infinite-scroll-component";
import { Tweet } from "react-twitter-widgets";

import "./rawTweets.css";
import { FetchTweetsRedis } from "../../api/api";

//url
const url = "http://localhost:3001";

export function RawTweets() {
  const [keywords, setKeywords] = useState();

  const [{ response, loading, error }, again] = FetchTweetsRedis();
  const [i, setI] = useState(1);

  //states for infinite scroll
  const handleInput = (e) => {
    // console.log(e.target.value);
    setKeywords(e.target.value);
  };

  const handleAdd = () => {
    //after 3 seconds, kill me
    again(i);
    setI((prev) => prev + 1);
  };

  //infinite scroll
  // const infiniteRef = useInfiniteScroll({
  //   loading,
  //   hasNextPage: true,
  //   onLoadMore: handleAdd,
  // });

  if (loading === true) {
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
  } else if (loading === false) {
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
        {/* <div ref={infiniteRef}> */}
        <InfiniteScroll
          dataLength={response.length}
          next={handleAdd}
          hasMore={true}
          loader={
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
          }
        >
          {response.map((data) => {
            return (
              <Reveal effect="fadeInUp">
                <Row className="justify-content-md-center">
                  <Col md={{ offset: 3 }}>
                    <Tweet className="tweet" tweetId={`${data}`} />
                  </Col>
                </Row>
              </Reveal>
            );
          })}
        </InfiniteScroll>
        {/* </div> */}
      </Container>
    );
  }
  // return <h1>Hello</h1>;
}
