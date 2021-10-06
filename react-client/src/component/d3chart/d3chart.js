import * as d3 from "d3";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import socketio from "socket.io-client";

//url
const url = "http://localhost:3001";

export default function D3Chart(props) {
  const ref = useRef();
  const [keywords, setKeywords] = useState([]);
  const [response, setResponse] = useState([]);
  const [timeDomain, setTimeDomain] = useState([]);

  //handle change
  const handleChange = (newValue, actionMeta) => {
    setKeywords(newValue.map((val) => val.value));
    console.log(keywords);
  };

  //get sentiment data
  const handleSentiment = useCallback(() => {
    try {
      const socket = socketio(url);
      socket.emit("streaming", keywords);
      socket.on("sentimentData", (data) => {
        // console.log(data);
        setResponse((prev) => [...prev, data]);
        if (timeDomain.includes(data.createdTime) === false) {
          setTimeDomain((prev) =>
            Array.from(new Set([...prev, data.createdTime]))
          );
        }
      });
      setTimeout(() => {
        socket.disconnect();
        socket.close();
        return;
      }, 5 * 1000);
    } catch (err) {
      console.log(err);
    }
  }, []);

  //margin, width, height
  const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 1200 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

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
    const node = () =>
      svg
        .append("g")
        .selectAll("circle")
        .data(response) //get the data
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
            .attr("r", 10)
            .transition()
            .duration(500);
        });

    const updateChart = () => {
      //update node
      node();

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
  }, [response]);

  return (
    <Container>
      <Form.Group className="mb-3">
        <Row>
          <Form.Label>Sentiment Analysis</Form.Label>
          <Col className="col-search-rule" md={10}>
            <CreatableSelect isMulti onChange={handleChange} />
          </Col>
          <Col md={2} className="col-btn-add">
            <Button variant="primary" onClick={handleSentiment}>
              Stream
            </Button>
          </Col>
        </Row>
      </Form.Group>

      <svg ref={ref} width={"100%"} height={`100vh`} />
    </Container>
  );
}
