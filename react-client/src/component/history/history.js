import { useState, useContext } from "react";
import * as axios from "axios";
import { SelectPicker } from "rsuite";
import { Container } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { Row, Col } from "react-bootstrap";
import { UuidContext } from "../../uuid/uuid";
import { Tweet } from "react-twitter-widgets";

const defaultDatasets = {
  labels: ["Positive", "Negative"],
  datasets: [
    {
      label: "Number of Tweets",
      data: [0, 0],
      backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
      borderColor: ["rgba(75, 192, 192)", "rgba(255, 99, 132)"],
      borderWidth: 1,
    },
  ],
};

const options = {
  plugins: {
    title: {
      display: true,
      text: "Sentiment Bar Chart",
    },
  },
};

export default function History() {
  const [currentRules, setCurrentRules] = useState([]);
  const [sentimentData, setSentimentData] = useState([1]);
  const [datasets, setDatasets] = useState(defaultDatasets);
  const { uuid } = useContext(UuidContext);

  const [rules, setRules] = useState([]);
  const handleChange = async (value, event) => {
    setCurrentRules(value);
    /** Get history data */
    if (currentRules) {
      const url = `/getTweets?uuid=${uuid}&rules=${value}`;
      let good = 0;
      let bad = 0;
      await axios.get(url).then((res) => {
        console.log(res.data.data[0].data);
        setSentimentData(res.data.data[0].data);
        res.data.data[0].data.forEach((e) => {
          if (e.sentimentData >= 0) {
            good += 1;
          } else {
            bad += 1;
          }
        });
        setDatasets({
          labels: ["Positive", "Negative"],
          datasets: [
            {
              label: "Sentiment Bar Chart",
              data: [good, bad],
              backgroundColor: [
                "rgba(75, 192, 192, 0.2)",
                "rgba(255, 99, 132, 0.2)",
              ],
              borderColor: ["rgba(75, 192, 192)", "rgba(255, 99, 132)"],
              borderWidth: 1,
            },
          ],
        });
      });
    }
  };

  const handleOnClick = async () => {
    const url = `/getAllRules?uuid=${uuid}`;
    axios.get(url).then((res) => {
      // console.log(res);
      setRules(res.data);
    });
  };

  return (
    <Container>
      <Row>
        <Col>
          <SelectPicker
            data={rules.rules}
            block
            onChange={handleChange}
            onClick={handleOnClick}
          />
        </Col>
      </Row>
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
        </Col>
        <Col md={6}>
          <div className="sentiment-chart">
            <Bar data={datasets} options={options} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
