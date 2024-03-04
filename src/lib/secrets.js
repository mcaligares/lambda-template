const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');

const AWS_REGION = 'us-east-2';
const STAGE = process.env.STAGE || 'prod';
const DATABASE_URL = `/serverless-template-api/${STAGE}/database-url`;

async function getConnectionString() {
  const config = { region: AWS_REGION };
  const client = new SSMClient(config)
  const paramStoreData = {
    Name: DATABASE_URL,
    WithDecryption: true
  };
  const command = new GetParameterCommand(paramStoreData);
  const result = await client.send(command);

  return result.Parameter.Value;
}

module.exports.getConnectionString = getConnectionString;