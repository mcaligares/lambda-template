const {
  SSMClient,
  GetParameterCommand,
  PutParameterCommand,
} = require('@aws-sdk/client-ssm');

const AWS_REGION = 'us-east-2';
const STAGE = process.env.STAGE || 'prod';

async function getConnectionString() {
  const DATABASE_URL = `/serverless-template-api/${STAGE}/database-url`;
  const config = { region: AWS_REGION };
  const client = new SSMClient(config)
  const paramStoreData = {
    Name: DATABASE_URL,
    WithDecryption: true
  };
  console.log('paramStoreData', paramStoreData);
  const command = new GetParameterCommand(paramStoreData);
  console.log('GetParameterCommand', command);
  const result = await client.send(command);
  console.log('SSMClientResult', result);

  return result.Parameter.Value;
}

async function putDatabaseUrl(stage, dbUrlVal) {
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
    Type: 'SecureString',
    Overwrite: true,
  };
  const command = new PutParameterCommand(paramStoreData);
  const result = await client.send(command);

  return result;
}

module.exports.getConnectionString = getConnectionString;
module.exports.putDatabaseUrl = putDatabaseUrl;