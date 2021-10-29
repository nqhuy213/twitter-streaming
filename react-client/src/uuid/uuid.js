import { useState, useEffect, createContext } from "react";
import * as axios from "axios";

const UuidContext = createContext();

const UuidProvider = (props) => {
  const url = "http://localhost:3001/getUuid";
  const [uuid, setUuid] = useState("");
  const [error, setError] = useState({ status: false, message: "" });

  const getRepo = async () => {
    await axios
      .get(url)
      .then((res) => setUuid(res.data))
      .catch((err) => setError({ status: true, message: err.data }));
  };
  useEffect(() => {
    getRepo();
  }, [error]);

  return (
    <UuidContext.Provider value={{ uuid, error }}>
      {props.children}
    </UuidContext.Provider>
  );
};

export { UuidContext, UuidProvider };
