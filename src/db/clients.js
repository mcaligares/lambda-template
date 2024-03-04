const { neon, neonConfig } = require("@neondatabase/serverless");
const secrets = require('../lib/secrets');

async function getDbClient() {
  const connectionString = await secrets.getConnectionString();

  // The `fetchConnectionCache` option is deprecated (now always `true`)
  // neonConfig.fetchConnectionCache = true;
  const sql = neon(connectionString);

  return sql;
}

module.exports.getDbClient = getDbClient;
