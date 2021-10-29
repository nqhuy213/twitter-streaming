import { useState, useContext, useRef, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import { Tweet } from "react-twitter-widgets";
import "./rawTweets.css";
import * as axios from "axios";
import { UuidContext } from "../../uuid/uuid";
import { InputNumber } from "rsuite";

import * as d3 from "d3";

//url

export function RawTweets() {
  const searchURL = `http://localhost:3001/api/search`;
  const streamRulesURL = `http://localhost:3001/api/stream-rules`;
  const deleteRulesURL = `http://localhost:3001/api/delete-rules`;

  //states
  const [keywords, setKeywords] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeDomain, setTimeDomain] = useState([]);
  const [seconds, setSeconds] = useState(5);
  // const [error, setError] = useState({ status: false, message: "" });
  const [flag, setFlag] = useState(false);

  //ref for svg
  const ref = useRef();

  //uuid
  const { uuid } = useContext(UuidContext);

  //handle change in search bar
  const handleChange = (newValue, actionMeta) => {
    setKeywords(newValue.map((val) => val.value));
  };

  //handle seconds in time bar
  const handleSecond = (e) => {
    setSeconds(e);
  };

  //adding rules and emit to the socket
  const handleAdd = () => {
    //url
    axios.post(streamRulesURL, {
      clientId: uuid,
      rules: keywords,
    });
    let rules = keywords.map((keyword) => {
      return { value: `${keyword} lang:en` };
    });
    setFlag(true);

    console.log(rules);

    setTimeout(() => {
      axios.delete(deleteRulesURL, {
        data: {
          clientId: uuid,
          rules: rules,
        },
      });
      setFlag(false);
    }, seconds * 1000);
  };

  useEffect(() => {
    if (flag === true) {
      const interval = setInterval(() => {
        axios
          .post(searchURL, {
            clientId: uuid,
            rules: keywords,
          })
          .then((res) => {
            // console.log(res.data);
            if (res.data.payload.result.data !== null) {
              let temp = res.data.payload.result.data.map((sentimentData) => {
                return sentimentData.createdTime;
              });
              setSentimentData(res.data.payload.result.data);
              setTimeDomain(temp);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }, 1 * 1000); //10 seconds
      return () => clearInterval(interval);
    }
  }, [flag]);

  const handleClear = () => {
    setSentimentData([]);
    setTimeDomain([]);
  };

  /** sentiment chart */
  const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // design tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white");

  //format time using d3
  const formatTime = d3.timeFormat("%H:%M:%S");

  useEffect(() => {
    //if update, make sure to delete old svg
    d3.selectAll(".svg-container").remove();
    // create svg container
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("class", "svg-container")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X axis
    const x = d3
      .scaleLinear()
      .domain([Math.min(...timeDomain) - 500, Math.max(...timeDomain)])
      .range([0, width]);
    const xAxis = () =>
      svg
        .append("g")
        .attr("class", "xAxis")
        .attr("transform", `translate(0, ${height})`)
        .transition()
        .duration(500)
        .call(
          d3
            .axisBottom()
            .scale(x)
            .ticks(timeDomain.length)
            .tickFormat(d3.timeFormat("%H:%M:%S"))
        );

    // Add Y axis
    const y = d3.scaleLinear().domain([-1.0, 1.0]).range([height, 0]);
    const yAxis = () => {
      svg.append("g").attr("class", "yAxis").call(d3.axisLeft(y));
    };

    //design node
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(sentimentData) //get the data
      .join((enter) => {
        return enter
          .append("circle")
          .attr("fill", (d) => {
            return d.sentimentData < 0 ? "red" : "green";
          })
          .attr("stroke-width", "1px")
          .attr("stroke", "black")
          .attr("cx", (d) => {
            return x(d.createdTime);
          })
          .attr("cy", (d) => {
            // console.log(d);
            return y(d.sentimentData);
          })
          .attr("r", 5)
          .transition()
          .duration(500);
      });

    //mouse events for node
    node
      .on("mouseover", (event, d) => {
        tooltip
          .html(
            () =>
              "tweet id: " +
              d.tweetId +
              "<br>" +
              "created at: " +
              formatTime(d.createdTime) +
              "<br>" +
              "sentiment: " +
              d.sentimentData
          )
          .style("visibility", "visible");
      })
      .on("mouseout", (event, d) => {
        tooltip.style("visibility", "hidden");
      })
      .on("mousemove", (event) => {
        return tooltip
          .style("left", event.pageX - 100 + "px")
          .style("top", event.pageY - 100 + "px");
      });

    const updateChart = () => {
      //update node
      svg.node();

      //update xAxis
      //update domain
      x.domain([Math.min(...timeDomain) - 500, Math.max(...timeDomain)]).range([
        0,
        width,
      ]);
      xAxis();
    };

    yAxis();
    updateChart();

    //update every time if catch new data
  }, [timeDomain]);

  return (
    <Container>
      <Form.Group className="mb-3">
        <Row>
          <Form.Label>Adding Rules</Form.Label>
          <Col className="col-search-rule" md={8}>
            <CreatableSelect isMulti onChange={handleChange} />
          </Col>
          <Col md={2} className="col-btn-add">
            <div style={{ width: "100%" }}>
              <InputNumber
                defaultValue={5}
                postfix="seconds"
                min={0}
                max={60}
                onChange={handleSecond}
              />
            </div>
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
      <Row>
        <Col md={6}>
          {sentimentData.map((data) => {
            let status;
            if (data.sentimentData < 0) {
              status = "Negative";
            } else {
              status = "Positive";
            }
            return (
              <Row className="justify-content-md-center">
                <Col md={{ offset: 3 }}>
                  <p>
                    Tweet ID: {data.tweetId} is {status}
                  </p>

                  <Tweet className="tweet" tweetId={`${data.tweetId}`} />
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
        </Col>
        <Col md={6}>
          <div className="sentiment-chart" style={{ textAlign: "center" }}>
            <svg ref={ref} width={"100%"} height={`400px`} />
            <h2>Sentiment Scatter Plot Chart</h2>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
