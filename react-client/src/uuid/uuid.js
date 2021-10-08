import { useState, useEffect, createContext } from "react";
import * as axios from "axios";
// const { v4: uuidv4 } = require("uuid");

const UuidContext = createContext();
// export const uuidReact = uuidv4();

//get the uuid from the server
const UuidProvider = (props) => {
  const url = "http://localhost:3001/getUuid";
  const [uuid, setUuid] = useState();
  const [error, setError] = useState(false);

  useEffect(() => {
    const getRepo = async () => {
      try {
        const res = await axios.get(url);
        if (res.statusText === "OK") {
          console.log(res.data);
          setUuid(res.data);
        } else {
          setError(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getRepo();
  }, [error]);

  return (
    <UuidContext.Provider value={{ uuid, error }}>
      {props.children}
    </UuidContext.Provider>
  );
};

export { UuidContext, UuidProvider };
