import express from "express";
import serverless from "serverless-http";
import { getDbClient } from './db/clients';
import * as crud from './db/crud';
import * as validators from './db/validators';

const app = express();
const STAGE = process.env.STAGE || 'prod';

app.use(express.json());

app.get("/", async (req, res, next) => {
  const db = await getDbClient();
  const now = Date.now();
  const result = await db(`select now()`);
  console.log('result', result);
  const dbNowResult = result[0].now as Date;
  const delta = (dbNowResult.getTime() - now) / 1000;

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

export const handler = serverless(app);
