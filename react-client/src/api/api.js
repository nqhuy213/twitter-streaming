import { useState, useEffect } from "react";
import * as axios from "axios";

//fetch all tweets which are saved in redis
export function FetchTweetsRedis() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({ status: false, message: "" });

  const getRepo = async () => {
    await axios
      .get("http://localhost:3001/getTweetsCache")
      .then((res) => {
        // console.log(res.data);
        setResponse(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError({ status: true, message: err });
        setLoading(false);
      });
  };
  useEffect(() => {
    setLoading(true);
    getRepo();
  }, []);

  if (response !== []) {
    return { response, loading, error };
  }
}
