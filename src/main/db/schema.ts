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

export const positions = sqliteTable('positions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  description: text('description')
});

export const jobGrades = sqliteTable(
  'job_grades',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    positionId: integer('position_id')
      .references((): AnySQLiteColumn => positions.id)
      .notNull(),
    level: text('level', { enum: jobGradeLevel }).notNull(),
    minSalary: integer('min_salary').notNull(), // Monthly salary
    maxSalary: integer('max_salary').notNull(), // Monthly salary
    timeInRole: integer('time_in_role').notNull(), // In months
    description: text('description'),
    headcount: integer('headcount')
  },
  (table) => [unique().on(table.positionId, table.level)]
);

export const jobGradesRelation = relations(jobGrades, ({ one }) => ({
  position: one(positions, {
    fields: [jobGrades.positionId],
    references: [positions.id],
    relationName: 'job_grades_to_positions'
  })
}));

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
  jobGradeId: integer('job_grade_id').references((): AnySQLiteColumn => jobGrades.id),
  lastPromotionDate: integer('', { mode: 'timestamp' }).notNull(),
  organizationId: integer('organization_id').references(
    (): AnySQLiteColumn => organizationalUnits.id
  ),
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
  jobGrade: one(jobGrades, {
    fields: [employees.jobGradeId],
    references: [jobGrades.id],
    relationName: 'employees_to_job_grades'
  })
}));

export const rewardCategories = ['REWARD', 'DISCIPLINARY_ACTION'] as const;
export type RewardCategory = (typeof rewardCategories)[number];

export const rewards = sqliteTable('rewards_and_disciplinary_actions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  employeeId: integer('employee_id')
    .references((): AnySQLiteColumn => employees.id)
    .notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  adjustment: integer('adjustment').notNull(), // In months
  issuedAt: integer('issued_at', { mode: 'timestamp' }).notNull(),
  category: text('category', { enum: rewardCategories }).notNull()
});

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
export type JobGrade = typeof jobGrades.$inferSelect;
export type NewJobGrade = typeof jobGrades.$inferInsert;
export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;
export type Reward = typeof rewards.$inferSelect;
export type NewReward = typeof rewards.$inferInsert;
export type PerformanceEvaluation = typeof performanceEvaluations.$inferSelect;
export type NewPerformanceEvaluation = typeof performanceEvaluations.$inferInsert;
