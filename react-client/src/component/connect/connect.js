import { useContext, useEffect, useState, useCallback } from "react";
import { SocketContext } from "../../context/socket";
import { Container } from "react-bootstrap";
import BootstrapSwitchButton from "bootstrap-switch-button-react";

export function Connect() {
  const [status, setStatus] = useState(true);

  const [response, setResponse] = useState();
  const socket = useContext(SocketContext);
  console.log(socket);

  //handle click
  const handleClick = useCallback((checked) => {
    setStatus(checked);
    console.log(checked);
  }, []);

  //initializing
  const keywords = ["dog", "bear"];
  socket.emit("streaming", keywords);

  useEffect(() => {
    // const socket = io(url);

    // if (status === true) {

    socket.on("data", (data) => {
      // console.log(data.data.text);
      // return data;
      setResponse(data.data.text);
    });
    // } else if (status === false) {
    //   socket.removeAllListeners("data");
    //   socket.disconnect();
    // }
  }, [socket, status]);
  // socket.on("sentimentData", (data) => {
  //   // console.log(data);
  // });
  return (
    <Container>
      <BootstrapSwitchButton
        width={100}
        checked={true}
        onlabel="Live"
        offlabel="Pause"
        onChange={(checked) => handleClick(checked)}
      />
      <h1>{response}</h1>
    </Container>
  );
}
