import "./App.css";
import { RawTweets } from "./component/rawTweets/rawTweets";

function App() {
  // let data = Connect("http://localhost:3001");
  // console.log(data);
  return (
    <div className="App">
      {/* <h1>{data}</h1> */}
      <RawTweets />
    </div>
  );
}

export default App;
