import { useEffect, useState, useContext } from "react";
import * as axios from "axios";
import { SelectPicker } from "rsuite";
import { Container } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { Row, Col, Button } from "react-bootstrap";
import { UuidContext } from "../../uuid/uuid";

//get list of rules
function GetHistoryRules(clientId, update) {
  //query

  const url = `http://localhost:3001/getAllRules?uuid=${clientId}`;

  //states
  const [rules, setRules] = useState([]);
  const [rulesLoading, setRulesLoading] = useState(true);
  const [rulesError, setRulesError] = useState({ status: false, message: "" });

  const getRepo = async () => {
    await axios
      .get(url)
      .then((res) => {
        // console.log(res);
        setRules(res.data);
        setRulesLoading(false);
      })
      .catch((err) => {
        setRulesError({ status: true, message: err.response.data.error });
      });
  };

  useEffect(() => {
    setRulesLoading(true);
    if (clientId !== "") {
      getRepo();
    }
  }, [update]);
  return { rules, rulesLoading, rulesError };
}

// get data associated with the rules
function GetHistoryTweets(clientId, rules) {
  //query
  const url = `http://localhost:3001/getTweets?uuid=${clientId}&rules=${rules}`;

  console.log(clientId);
  // console.log(rules);
  //states
  const [repo, setRepo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({ status: false, message: "" });

  const getRepo = async () => {
    await axios
      .get(url)
      .then((res) => {
        setRepo(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError({ status: true, message: err.response.data.error });
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    getRepo();
  }, [rules]);
  return { repo, loading, error };
}

export default function History() {
  //default states
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

  const [update, setUpdate] = useState(false);
  //states
  const [currentRules, setCurrentRules] = useState([]);
  const [datasets, setDatasets] = useState(defaultDatasets);

  //uuid
  const { uuid, uuidError } = useContext(UuidContext);

  //get rules
  const { rules, rulesLoading, rulesError } = GetHistoryRules(
    uuid.toString(),
    update
  );
  console.log(rules);
  // console.log(rulesLoading);

  // get data
  const { repo, loading, error } = GetHistoryTweets(uuid, currentRules);

  //handle change
  const handleChange = (value, event) => {
    setCurrentRules(value);
    // console.log(value);
  };

  //handle update
  const handleUpdate = () => {
    setUpdate((prev) => !prev);
  };

  useEffect(() => {
    setDatasets(defaultDatasets);
    let good = 0;
    let bad = 0;

    if (repo.length !== 0) {
      //set number of good and bad
      repo[0].data.forEach((e) => {
        console.log(e);
        if (e.sentimentData >= 0) {
          good += 1;
        } else {
          bad += 1;
        }
      });
      setDatasets({
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
      });
      // console.log(datasets);
    }
    console.log(datasets);
  }, [repo]);

  // if (rulesLoading) {
  //   return (
  //     <div className="lds-roller">
  //       <div></div>
  //       <div></div>
  //       <div></div>
  //       <div></div>
  //       <div></div>
  //       <div></div>
  //       <div></div>
  //       <div></div>
  //     </div>
  //   );
  // } else {
  return (
    <Container>
      <Row>
        <Col md={11}>
          <SelectPicker data={rules.rules} block onChange={handleChange} />
        </Col>
        <Col md={1}>
          <Button
            className="btn-add"
            variant="primary"
            type="submit"
            onClick={handleUpdate}
          >
            Update
          </Button>
        </Col>
      </Row>
      <Bar data={datasets} />
    </Container>
  );
}
// return <h1>Hello World</h1>;
// }

// export default function History() {
//   return <h1>Hello World</h1>;
// }
