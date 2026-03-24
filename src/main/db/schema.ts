import { relations } from 'drizzle-orm';
import { AnySQLiteColumn, integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';

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

export const jobGradeLevel = ['G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12'] as const;
export type JobGradeType = (typeof jobGradeLevel)[number];

export const position = sqliteTable('positions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  description: text('description')
});

export const jobGrades = sqliteTable(
  'job_grades',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    positionId: integer('position_id').references((): AnySQLiteColumn => position.id),
    level: text('level', { enum: jobGradeLevel }).notNull(),
    minSalary: integer('min_salary').notNull(), // Monthly salary
    maxSalary: integer('max_salary').notNull(), // Monthly salary
    timeInRole: integer('time_in_role').notNull(), // In months
    description: text('description')
  },
  (table) => [unique().on(table.positionId, table.level)]
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type OrganizationalUnit = typeof organizationalUnits.$inferSelect;
export type NewOrganizationalUnit = typeof organizationalUnits.$inferInsert;
