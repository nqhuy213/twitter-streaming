import { useState, useEffect, useContext, useCallback } from "react";
import { SocketContext } from "../context/socket";
import * as axios from "axios";

//fetch all tweets which are saved in redis
export function FetchTweetsRedis() {
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAgain, setAgain] = useState(0);
  const [error, setError] = useState({ status: false, message: "" });
  const { socket } = useContext(SocketContext);

  const liveStream = useCallback((keywords, timeout) => {
    try {
      // setLoading(true);
      setError(false);
      socket.emit("streaming", keywords);
      socket.on("data", (data) => {
        setResponse((prev) => {
          console.log(data.data.id);
          return [...prev, data.data.id];
        });
      });
      setTimeout(() => {
        socket.emit("deleteRules", keywords);
        socket.off("data"); //stop listening
        setLoading(false);
        return;
      }, timeout * 1000);
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    // setLoading(true);
    // getRepo();
    liveStream(["cat", "dog"], 2);
    // socket.on("data", (data) => setResponse(data));
  }, [isAgain]);

  if (response !== []) {
    return [{ response, loading, error }, setAgain];
  }
}
