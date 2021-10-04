import { useState, useEffect, useCallback } from "react";
// import { SocketContext } from "../context/socket";
import socketio from "socket.io-client";

const url = "http://localhost:3001";

//fetch all tweets which are saved in redis
export function FetchTweets() {
  const [response, setResponse] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState({ status: false, message: "" });

  const liveStream = useCallback((keywords, timeout) => {
    try {
      const socket = socketio(url);
      // console.log(keywords);
      setLoading(true);
      setError(false);
      socket.emit("streaming", keywords);
      socket.on("data", (data) => {
        setResponse((prev) => {
          return [...prev, [data.data, data.includes.users]];
        });
      });
      setTimeout(() => {
        // socket.emit("deleteRules", keywords);
        // socket.off("data"); //stop listening

        //disconnect socket
        socket.disconnect();
        socket.close();
        setLoading(false);
        return;
      }, timeout * 1000);
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    if (keywords !== []) {
      liveStream(keywords, 1);
    }
    // console.log(response);
  }, [attempt]);

  if (response !== []) {
    return [{ response, loading, error }, setAttempt, setKeywords, setResponse];
  }
}
