import { useEffect, useState, useContext } from "react";
import * as axios from "axios";
import { SelectPicker } from "rsuite";
import { Container } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { Row, Col } from "react-bootstrap";
import { UuidContext } from "../../uuid/uuid";

const defaultDatasets = {
  labels: ["Good", "Bad"],
  datasets: [
    {
      label: "Sentiment Bar Chart",
      data: [0, 0],
      backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
      borderColor: ["rgba(75, 192, 192)", "rgba(255, 99, 132)"],
      borderWidth: 1,
    },
  ],
};
export default function History() {
  //default states

  //states
  const [currentRules, setCurrentRules] = useState([]);
  const [datasets, setDatasets] = useState(defaultDatasets);

  //uuid
  const { uuid, uuidError } = useContext(UuidContext);

  //get rules
  const [rules, setRules] = useState([]);
  const [rulesError, setRulesError] = useState({ status: false, message: "" });
  // console.log(rulesLoading);

  // get data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ status: false });
  //handle change
  const handleChange = async (value, event) => {
    setCurrentRules(value);
    /** Get history data */
    if (currentRules) {
      const url = `http://localhost:3001/getTweets?uuid=${uuid}&rules=${value}`;
      setLoading(true);
      let good = 0;
      let bad = 0;
      await axios
        .get(url)
        .then((res) => {
          res.data.data[0].data.forEach((e) => {
            if (e.sentimentData >= 0) {
              good += 1;
            } else {
              bad += 1;
            }
          });
          setDatasets((prev) => ({
            labels: ["Good", "Bad"],
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
          }));
          setLoading(false);
        })
        .catch((err) => {
          setError({ status: true, message: err.response.data.error });
          setLoading(false);
        });
    }
  };

  const handleOnClick = async () => {
    const url = `http://localhost:3001/getAllRules?uuid=${uuid}`;
    axios
      .get(url)
      .then((res) => {
        // console.log(res);
        setRules(res.data);
      })
      .catch((err) => {
        setRulesError({ status: true, message: err.response.data.error });
      });
  };

  return (
    <Container>
      <Row>
        <Col md={12}>
          <SelectPicker
            data={rules.rules}
            block
            onChange={handleChange}
            onClick={handleOnClick}
          />
        </Col>
      </Row>
      <Bar data={datasets} />
    </Container>
  );
}
