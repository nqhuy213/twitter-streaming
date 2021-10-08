import * as d3 from "d3";
import { useContext, useEffect, useRef, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import socketio from "socket.io-client";
import { UuidContext } from "../../uuid/uuid";
import { InputNumber } from "rsuite";
import "./d3chart.css";

//url
const url = "http://localhost:3001";

export default function D3Chart() {
  //states
  const [keywords, setKeywords] = useState([]);
  const [response, setResponse] = useState([]);
  const [timeDomain, setTimeDomain] = useState([]);
  const [seconds, setSeconds] = useState(5);

  //uuid
  const { uuid, error } = useContext(UuidContext);

  //ref for svg
  const ref = useRef();

  //handle change
  const handleChange = (newValue, actionMeta) => {
    setKeywords(newValue.map((val) => val.value));
  };

  const handleSecond = (e) => {
    // console.log(e);
    setSeconds(e);
  };

  //get sentiment data
  const handleSentiment = () => {
    setResponse([]);
    setTimeDomain([]);
    try {
      //clear response

      const socket = socketio(url);
      //emit uuid and keyowrds to streaming
      socket.emit("streaming", { clientId: uuid, keywords });
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
      }, seconds * 1000);
    } catch (err) {
      console.log(err);
    }
  };

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
            .attr("r", 5)
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
            <CreatableSelect
              isMulti
              placeholder="Add rules here"
              onChange={handleChange}
            />
          </Col>
          <Col md={1} className="col-btn-add">
            <div style={{ width: 100 }}>
              <InputNumber
                defaultValue={5}
                min={0}
                max={60}
                onChange={handleSecond}
              />
            </div>
          </Col>
          <Col md={1} className="col-btn-add">
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
