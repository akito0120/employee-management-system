import { relations, sql } from 'drizzle-orm';
import {
  AnySQLiteColumn,
  check,
  integer,
  sqliteTable,
  text,
  unique
} from 'drizzle-orm/sqlite-core';

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

export const positions = sqliteTable(
  'positions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    code: text('code').notNull().unique(),
    description: text('description'),
    initialSalary: integer('initial_salary').notNull(), // In Euro
    raiseAmount: integer('raise_amount').notNull(), // In Euro
    timeInRole: integer('time_in_role'), // In Months,
    grade: integer('grade').notNull() // 1 (highest) to 12 (lowest)
  },
  (table) => [check('check_grade_value', sql`${table.grade} BETWEEN 1 AND 12`)]
);

export const employeeStatuses = [
  'ACTIVE',
  'SUSPENDED',
  'ON_LEAVE',
  'SICK_LEAVE',
  'PARENTAL_LEAVE',
  'NOTICE_PERIOD',
  'TERMINATED'
] as const;
export type EmployeeStatus = (typeof employeeStatuses)[number];

export const employees = sqliteTable('employees', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  positionId: integer('position_id')
    .references((): AnySQLiteColumn => positions.id)
    .notNull(),
  lastPromotionDate: integer('last_promotion_date', { mode: 'timestamp' }).notNull(),
  lastRaiseDate: integer('last_raise_date', { mode: 'timestamp' }).notNull(),
  organizationId: integer('organization_id')
    .references((): AnySQLiteColumn => organizationalUnits.id)
    .notNull(),
  isManager: integer('is_manager', { mode: 'boolean' }).notNull().default(false),
  code: text('code').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  birthDate: integer('birth_date', { mode: 'timestamp' }).notNull(),
  email: text('email'),
  phoneNumber: text('phone_number'),
  status: text('status', { enum: employeeStatuses }).notNull(),
  country: text('country'),
  state: text('state'),
  city: text('city'),
  line1: text('line1'),
  line2: text('line2'),
  postalCode: text('postal_code'),
  remarks: text('remarks'),
  baseSalary: integer('base_salary').notNull()
});

export const employeesRelation = relations(employees, ({ one }) => ({
  organization: one(organizationalUnits, {
    fields: [employees.organizationId],
    references: [organizationalUnits.id],
    relationName: 'employees_to_organizational_units'
  }),
  position: one(positions, {
    fields: [employees.positionId],
    references: [positions.id],
    relationName: 'employees_to_positions'
  })
}));

export const commendationCategories = ['COMMENDATION', 'SANCTION'] as const;
export type CommendationCategories = (typeof commendationCategories)[number];

export const commendations = sqliteTable('commendations_and_sanctions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  adjustment: integer('adjustment').notNull(), // In months
  issuedAt: integer('issued_at', { mode: 'timestamp' }).notNull(),
  category: text('category', { enum: commendationCategories }).notNull()
});

export const employeeCommendations = sqliteTable(
  'employee_commendations',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    employeeId: integer('employee_id')
      .notNull()
      .references((): AnySQLiteColumn => employees.id),
    commendationId: integer('commendation_id')
      .notNull()
      .references((): AnySQLiteColumn => commendations.id)
  },
  (table) => [unique().on(table.employeeId, table.commendationId)]
);

export const employeeCommendationsRelation = relations(employeeCommendations, ({ one }) => ({
  commendation: one(commendations, {
    fields: [employeeCommendations.commendationId],
    references: [commendations.id],
    relationName: 'employee_commendations_to_commendations'
  })
}));

export const performanceEvaluations = sqliteTable('performance_evaluations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  score: text('score').notNull(),
  description: text('description').notNull(),
  evaluatedAt: integer('evaluatedAt', { mode: 'timestamp' }).notNull()
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type OrganizationalUnit = typeof organizationalUnits.$inferSelect;
export type NewOrganizationalUnit = typeof organizationalUnits.$inferInsert;
export type Position = typeof positions.$inferSelect;
export type NewPosition = typeof positions.$inferInsert;
export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;
export type Commendation = typeof commendations.$inferSelect;
export type NewCommendation = typeof commendations.$inferInsert;
export type PerformanceEvaluation = typeof performanceEvaluations.$inferSelect;
export type NewPerformanceEvaluation = typeof performanceEvaluations.$inferInsert;
export type EmployeeCommendation = typeof employeeCommendations.$inferSelect;
export type NewEmployeeCommendation = typeof employeeCommendations.$inferInsert;
