import { text, pgTable, timestamp, serial, boolean } from "drizzle-orm/pg-core";

export const LeadTable = pgTable('leads', {
  id: serial('id').primaryKey().notNull(),
  email: text('email').notNull(),
  description: text('description').default('This is a default value'),
  createdAt: timestamp('created_at').defaultNow(),
});
