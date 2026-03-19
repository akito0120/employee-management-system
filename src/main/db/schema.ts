import { relations } from 'drizzle-orm';
import { AnySQLiteColumn, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  isAdmin: integer('is_admin', { mode: 'boolean' }).default(false).notNull()
});

export const organizationalUnitTypes = ['DEPARTMENT', 'SUB_DEPARTMENT', 'UNIT'] as const;
export const organizationalUnitStatuses = ['ACTIVE', 'SUSPENDED', 'CLOSED'] as const;

export type OrganizationalUnitType = (typeof organizationalUnitTypes)[number];
export type OrganizationalUnitStatus = (typeof organizationalUnitStatuses)[number];

export const organizationalUnits = sqliteTable('organizational_units', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  code: text('code').unique().notNull(),
  type: text('type', { enum: organizationalUnitTypes }).notNull(),
  status: text('status', { enum: organizationalUnitStatuses }).notNull(),
  parentId: integer('parent_id').references((): AnySQLiteColumn => organizationalUnits.id),
  description: text('description')
});

export const organizationalUnitRelations = relations(organizationalUnits, ({ one, many }) => ({
  parent: one(organizationalUnits, {
    fields: [organizationalUnits.parentId],
    references: [organizationalUnits.id],
    relationName: 'parent'
  }),
  children: many(organizationalUnits, {
    relationName: 'children'
  })
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type OrganizationalUnit = typeof organizationalUnits.$inferSelect;
export type NewOrganizationalUnit = typeof organizationalUnits.$inferInsert;
