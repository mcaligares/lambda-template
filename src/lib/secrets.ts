import { SSMClient, GetParameterCommand, PutParameterCommand, ParameterType } from '@aws-sdk/client-ssm';

const AWS_REGION = 'us-east-2';
const STAGE = process.env.STAGE || 'prod';

export async function getConnectionString() {
  const DATABASE_URL = `/serverless-template-api/${STAGE}/database-url`;
  const config = { region: AWS_REGION };
  const client = new SSMClient(config)
  const paramStoreData = {
    Name: DATABASE_URL,
    WithDecryption: true
  };
  const command = new GetParameterCommand(paramStoreData);
  const result = await client.send(command);
  const connectionString = result?.Parameter?.Value;

  if (!connectionString) {
    throw 'Connection string not defined';
  }

  return connectionString;
}

export async function putDatabaseUrl(stage, dbUrlVal) {
  const paramStage = stage ? stage : 'dev';
  if (paramStage === 'prod') {
    return;
  }
  if (!dbUrlVal) {
    return;
  }

  const DATABASE_URL = `/serverless-template-api/${paramStage}/database-url`;
  const config = { region: AWS_REGION };
  const client = new SSMClient(config)
  const paramStoreData = {
    Name: DATABASE_URL,
    Value: dbUrlVal,
    Type: ParameterType.SECURE_STRING,
    Overwrite: true,
  };
  const command = new PutParameterCommand(paramStoreData);
  const result = await client.send(command);

  return result;
}
