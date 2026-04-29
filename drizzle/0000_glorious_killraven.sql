CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`performed_at` integer NOT NULL,
	`userId` integer NOT NULL,
	`category` text NOT NULL,
	`target` text,
	`targetId` integer,
	`old_value` text,
	`new_value` text,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `commendations_and_sanctions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`adjustment` integer NOT NULL,
	`issued_at` integer NOT NULL,
	`category` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `employee_commendations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`employee_id` integer NOT NULL,
	`commendation_id` integer NOT NULL,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`commendation_id`) REFERENCES `commendations_and_sanctions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `employee_commendations_employee_id_commendation_id_unique` ON `employee_commendations` (`employee_id`,`commendation_id`);--> statement-breakpoint
CREATE TABLE `employees` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`position_id` integer NOT NULL,
	`last_raise_date` integer NOT NULL,
	`raise_count` integer NOT NULL,
	`organization_id` integer NOT NULL,
	`code` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`birth_date` integer NOT NULL,
	`email` text,
	`phone_number` text,
	`status` text NOT NULL,
	`country` text,
	`state` text,
	`city` text,
	`line1` text,
	`line2` text,
	`postal_code` text,
	`remarks` text,
	`base_salary` integer NOT NULL,
	FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organization_id`) REFERENCES `organizational_units`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `employees_code_unique` ON `employees` (`code`);--> statement-breakpoint
CREATE TABLE `organizational_units` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`type` text NOT NULL,
	`status` text NOT NULL,
	`parent_id` integer,
	`description` text,
	FOREIGN KEY (`parent_id`) REFERENCES `organizational_units`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organizational_units_code_unique` ON `organizational_units` (`code`);--> statement-breakpoint
CREATE TABLE `performance_evaluations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`score` text NOT NULL,
	`description` text NOT NULL,
	`evaluatedAt` integer NOT NULL,
	`evaluator_employee` text NOT NULL,
	`evaluated_employee` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `positions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`description` text,
	`initial_salary` integer NOT NULL,
	`raise_amount` integer NOT NULL,
	`raise_count` integer NOT NULL,
	`grade` integer NOT NULL,
	CONSTRAINT "check_grade_value" CHECK("positions"."grade" BETWEEN 1 AND 12)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `positions_code_unique` ON `positions` (`code`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`is_admin` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);