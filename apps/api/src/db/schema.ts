import { timestamp } from 'drizzle-orm/pg-core';
import { serial } from 'drizzle-orm/pg-core';
import { pgTable, text } from 'drizzle-orm/pg-core';

/**
 * HELPERS
 */
const timestamps = {
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
  createdBy: text('created_by').notNull(),
  updatedBy: text('updated_by').notNull(),
  deletedBy: text('deleted_by'),
};

/**
 * NOTIFICATIONS
 */

/**
 * PROJECTS
 */
export const projectsTable = pgTable('projects', {
  id: serial('id').primaryKey(),
  orgId: text('org_id').notNull(),
  name: text('name').notNull(),
  ...timestamps,
});
