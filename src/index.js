const express = require("express");
const serverless = require("serverless-http");
const { getDbClient } = require('./db/clients');
const crud = require('./db/crud');
const validators = require('./db/validators');

const app = express();
const STAGE = process.env.STAGE || 'prod';

app.use(express.json());

app.get("/", async (req, res, next) => {
  const db = await getDbClient();
  const now = Date.now();
  const [dbNowResult] = await db`select now()`;
  const delta = (dbNowResult.now.getTime() - now) / 1000;

  return res.status(200).json({
    datetime: new Date(),
    delta: delta,
    STAGE
  });
});

app.get("/leads", async (req, res, next) => {
  const results = await crud.getLead(2);

  return res.status(200).json({
    results
  });
});

app.post("/leads", async (req, res, next) => {
  const postData = await req.body;
  const { data, hasError, message } = await validators.validateLead(postData);

  if (hasError === true) {
    return res.status(400).json({
      massage: message ? message : 'Invalid request. Please try again'
    });
  } else if (hasError === undefined) {
    return res.status(500).json({
      message: "Server Error"
    });
  }

  const results = await crud.newLead(data);

  return res.status(201).json({
    results
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
