import { neon } from "@neondatabase/serverless";
import * as secrets from '../lib/secrets';
import { drizzle } from 'drizzle-orm/neon-http';

export async function getDbClient() {
  const connectionString = await secrets.getConnectionString();

  return neon<boolean, boolean>(connectionString);
}

export async function getDrizzleDbClient() {
  const client = await getDbClient();

  return drizzle(client);
}