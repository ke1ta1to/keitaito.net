import { sql } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),

  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => sql`now()`),
});

export type User = typeof usersTable.$inferSelect;

export const activitiesTable = pgTable('activities', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => usersTable.id),
  title: text().notNull(),
  description: text().notNull(),
  dateText: text().notNull(),
});

export type Activity = typeof activitiesTable.$inferSelect;
