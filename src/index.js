const serverless = require("serverless-http");
const express = require("express");
const { getDbClient } = require('./db/clients');

const app = express();

app.get("/", async (req, res, next) => {
  const db = await getDbClient();
  const now = Date.now();
  const [dbNowResult] = await db`select now()`;
  const delta = (dbNowResult.now.getTime() - now) / 1000;

  return res.status(200).json({
    message: "Hello from root!",
    delta: delta
  });
});``

app.get("/path", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

app.listen(3000, () => {
  console.log('running at localhost:3000')
});

module.exports.handler = serverless(app);
