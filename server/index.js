import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import express from "express";
import cors from "cors";
import axios from "axios";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4000;
const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

const app = express();

const POLY_API_V1 = "https://api.polygon.io/v1";
const POLY_API_V2 = "https://api.polygon.io/v2";
const POLY_API_V3 = "https://api.polygon.io/v3";

// const dataDir = __dirname + "/data";
// const openClose = require(dataDir + "/day-open-close.json");
// const prevClose = require(dataDir + "/prev-close.json");

// async function getData() {
//   try {
//     const result = await axios.get(url);
//     return result.data;
//   } catch (err) {
//     console.error(err);
//   }
// }

// function makeError(message, status) {
//   let err = message instanceof Error ? message : new Error(message);
//   err.status = status;
//   return err;
// }

app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(cors());

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// static file data
app.get("/api/day-open-close/:symbol", async (req, res) => {
  // responding with saved data for demo purposes
  const { symbol } = req.params;
  for (let i = 0; i < openClose.length; i++) {
    if (openClose[i].symbol === symbol) {
      res.json(openClose[i]);
      break;
    }
  }
  if (!res.headersSent) res.json({ message: "Symbol data not available." });
});

// static file data
app.get("/api/prev-close/:symbol", async (req, res) => {
  // responding with saved data for demo purposes
  const { symbol } = req.params;
  for (let i = 0; i < prevClose.length; i++) {
    if (prevClose[i].ticker === symbol) {
      res.json(prevClose[i]);
      break;
    }
  }
  if (!res.headersSent) res.json({ message: "Symbol data not available." });
});

// static file data
app.get("/api/intraday/:symbol", async (req, res) => {
  // responding with saved data for demo purposes
  const { symbol } = req.params;
  const intradayData = require(dataDir + `/intraday/${symbol}.json`);

  res.json(intradayData);
  if (!res.headersSent) res.json({ message: "Symbol data not available." });
});

// Chart Data
// arbitrary timeframe
// from/to is YYYY-MM-DD
// timespan is minute, hour, day, week, month, quarter, year
app.get(
  "/api/aggs/ticker/:symbol/range/:multiplier/:timespan/:from/:to/:limit",
  async (req, res) => {
    const { symbol, multiplier, timespan, from, to, limit } = req.params;
    try {
      const response = await axios.get(
        POLY_API_V2 +
          `/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${from}/${to}?adjusted=true&sort=asc&limit=${limit}&apiKey=${POLYGON_API_KEY}`
      );
      res.json(response.data);
    } catch (error) {
      console.log(error);
    }
  }
);

// Gainers/Losers
app.get("/api/stocks/:direction", async (req, res) => {
  const { direction } = req.params;
  try {
    const response = await axios.get(
      POLY_API_V2 +
        `/snapshot/locale/us/markets/stocks/${direction}?apiKey=${POLYGON_API_KEY}`
    );

    res.json(response.data);
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/stocks/snapshot/:symbol", async (req, res) => {
  const { symbol } = req.params;
  try {
    const response = await axios.get(
      POLY_API_V2 +
        `/snapshot/locale/us/markets/stocks/tickers/${symbol}?apiKey=${POLYGON_API_KEY}`
    );

    res.json(response.data);
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/reference/news/:symbol", async (req, res) => {
  const { symbol } = req.params;
  try {
    const queryURL =
      POLY_API_V2 + `/reference/news?${symbol}&apiKey=${POLYGON_API_KEY}`;
    const response = await axios.get(queryURL);
    res.json(response.data);
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/reference/tickers/:symbol/:limit", async (req, res) => {
  const { symbol, limit } = req.params;

  try {
    const queryURL =
      POLY_API_V3 +
      `/reference/tickers?ticker=${symbol}&active=true&sort=ticker&order=asc&limit=${limit}&apiKey=${POLYGON_API_KEY}`;
    const response = await axios.get(queryURL);
    res.json(response.data);
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/reference/tickers/:symbol", async (req, res) => {
  const { symbol } = req.params;
  try {
    const queryURL =
      POLY_API_V3 + `/reference/tickers/${symbol}?apiKey=${POLYGON_API_KEY}`;
    const response = await axios.get(queryURL);
    res.json(response.data);
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/reference/tickers/:symbol/:limit/:range", async (req, res) => {
  const { symbol, limit, range } = req.params;

  try {
    const queryURL =
      POLY_API_V3 +
      `/reference/tickers?ticker${
        "." + range
      }=${symbol}&active=true&sort=ticker&order=asc&limit=${limit}&apiKey=${POLYGON_API_KEY}`;
    console.log(queryURL);
    const response = await axios.get(queryURL);
    res.json(response.data);
  } catch (error) {
    console.log(error);
  }
});
app.get(
  "/api/crypto/open-close/:baseCurrency/:quoteCurrency/:date",
  async (req, res) => {
    // date is YYYY-MM-DD
    const { baseCurrency, quoteCurrency, date } = req.params;
    try {
      const response = await axios.get(
        POLY_API_V1 +
          `/open-close/crypto/${baseCurrency}/${quoteCurrency}/${date}?adjusted=true&apiKey=${POLYGON_API_KEY}`
      );
      res.json(response.data);
    } catch (error) {
      console.log(error);
    }
  }
);

app.get("/api/forex/:forexPair/prev-close", async (req, res) => {
  const { forexPair } = req.params;
  try {
    const reponse = await axios.get(
      POLY_API_V2 + `/aggs/ticker/${forexPair}/prev`
    );
  } catch (error) {
    console.log(error);
  }
});

// Market Status
// when = "upcoming" -> upcoming market holidays
// when = "now" -> current status
app.get("/api/marketstatus/:when", async (req, res) => {
  const { when } = req.params;
  try {
    const response = await axios.get(
      POLY_API_V1 + `/marketstatus/${when}?apiKey=${POLYGON_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.log(error);
  }
});

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
// });

app.listen(PORT, () => {
  console.log(`API listening on ${PORT}`);
});
