import { useEffect, useState } from "react";
import "./styles/App.css";
import SymbolInput from "./components/SymbolInput";
import CardContainer from "./components/CardContainer";

function App() {
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:4000/api"
      : "https://stock-watcher-wcant.herokuapp.com/api";

  const [data, setData] = useState(null);

  const [symbols, setSymbols] = useState([]);
  console.log(symbols);
  useEffect(() => {
    try {
      fetch(url, {
        json: true,
        headers: { "User-Agent": "request" },
      })
        .then((res) => {
          if (res.status !== 200) {
            console.log("Status:", res.status);
          } else {
            // data is successfully parsed as a JSON object:
            return res.json();
          }
        })
        .then((data) => {
          console.log(data);
          setData(data);
        });
    } catch (error) {
      console.log("Error:", error);
    }
  }, []);

  return (
    <div className="App">
      <SymbolInput setSymbols={setSymbols} />
      <CardContainer />
    </div>
  );
}

export default App;
