// tsx src/cli/migrator.js
const { drizzle } = require('drizzle-orm/neon-serverless')
const { migrate } = require('drizzle-orm/postgres-js/migrator')
const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
const secrets = require('../lib/secrets');
const schema = require('../db/schemas');
require('dotenv').config();

async function performMigration() {
  const dbUrl = await secrets.getConnectionString();
  console.log(dbUrl);

  neonConfig.webSocketConstructor = ws;  // <-- this is the key bit

  const pool = new Pool({ connectionString: dbUrl });
  pool.on('error', err => console.error(err));  // deal with e.g. re-connect

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const db = await drizzle(client, { schema });
    await migrate(db, { migrationsFolder: 'src/migrations' })
    await client.query('COMMIT');

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;

  } finally {
    client.release();
  }

  await pool.end();
}

if (require.main === module) {
  console.log('Run Migrations');
  console.log(process.env.AWS_ACCESS_KEY_ID);
  performMigration().then(val => {
    console.log('Migrations done');
    process.exit(0);
  }).catch(err => {
    console.error('Migrations error', err);
    process.exit(1);
  })
}