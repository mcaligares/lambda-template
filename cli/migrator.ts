import ws from 'ws';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { getConnectionString } from '../src/lib/secrets';
import * as schema from '../src/db/schemas';

require('dotenv').config();

async function performMigration() {
  const connectionString = await getConnectionString();

  neonConfig.webSocketConstructor = ws;

  const pool = new Pool({ connectionString });
  pool.on('error', err => console.error(err));
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const db = drizzle(client, { schema });
    await migrate(db, { migrationsFolder: 'migrations' })
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
  console.log(`Run Migrations in ${process.env.STAGE}...`);
  performMigration().then(val => {
    console.log('Migrations done');
    process.exit(0);
  }).catch(err => {
    console.error('Migrations error', err);
    process.exit(1);
  })
}