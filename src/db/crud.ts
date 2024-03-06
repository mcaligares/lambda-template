import { desc, eq } from 'drizzle-orm';
import * as clients from './clients';
import * as schemas from './schemas';

export async function newLead({ email }) {
  const db = await clients.getDrizzleDbClient();
  const result = await db.insert(schemas.LeadTable). values({
    email,
  }).returning();

  if (result.length === 1) {
    return result[0];
  }

  return result;
}

export async function listLeads() {
  const db = await clients.getDrizzleDbClient();
  const result = await db.select().from(schemas.LeadTable)
    .orderBy(desc(schemas.LeadTable.createdAt))
    .limit(10);

  return result;
}

export async function getLead(id) {
  const db = await clients.getDrizzleDbClient();
  const result = await db.select().from(schemas.LeadTable)
    .where(eq(schemas.LeadTable.id, id));

  if (result.length === 1) {
    return result[0];
  }
  return null;
}
