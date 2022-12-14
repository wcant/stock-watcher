import {
  polygonClient,
  restClient,
  websocketClient,
} from "@polygon.io/client-js";
import path from "path";
import * as dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4000;
const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const rest = restClient(POLYGON_API_KEY);
const app = express();

app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(cors());

app.get("/api/test", async (req, res) => {
  try {
    const result = await rest.reference.tickerNews("MSFT");
    res.json(result);
  } catch (error) {
    console.error(error);
  }
});

// Get Snapshot of single ticker pricing info
app.get("/api/:market/snapshot/:ticker", (req, res) => {
  const { market, ticker } = req.params;

  try {
    if (market === "stocks") {
      rest.stocks.snapshotTicker(ticker).then((data) => res.json(data));
    }
    if (market === "options") {
      res.json({ error: `${market} data not available.` });
    }
    if (market === "forex") {
      res.json({ error: `${market} data not available.` });
    }
    if (market === "crypto") {
      res.json({ error: `${market} data not available.` });
    }
  } catch (error) {
    console.error(error);
  }
});

// Requests first 5 tickers that match the ticker string
// Used for the TickerInput/Dropdown component
app.get("/api/reference/tickers/:ticker/:limit/:range?", (req, res) => {
  // ref: https://github.com/polygon-io/client-js/blob/master/src/rest/reference/tickers.ts
  const { ticker, limit, range } = req.params;
  const queryType = range ? `ticker.${range}` : "ticker";
  try {
    rest.reference
      .tickers({
        [queryType]: ticker,
        limit: limit,
      })
      .then((data) => res.json(data));
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/reference/tickernews/:ticker/:limit", async (req, res) => {
  const { ticker, limit } = req.params;
  try {
    const result = await rest.reference.tickerNews({
      ticker: ticker,
      limit: limit,
    });
    res.json(result);
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/reference/tickerdetails/:ticker", async (req, res) => {
  const { ticker } = req.params;
  try {
    const result = await rest.reference.tickerDetails(ticker);
    res.json(result);
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`API listening on ${PORT}`);
});
