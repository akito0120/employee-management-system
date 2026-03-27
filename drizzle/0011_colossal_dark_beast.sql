CREATE TABLE `employee_rewards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`employee_id` integer NOT NULL,
	`reward_id` integer NOT NULL,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reward_id`) REFERENCES `rewards_and_disciplinary_actions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `employee_rewards_employee_id_reward_id_unique` ON `employee_rewards` (`employee_id`,`reward_id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_employees` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`job_grade_id` integer,
	`lastPromotionDate` integer NOT NULL,
	`organization_id` integer,
	`is_manager` integer DEFAULT false NOT NULL,
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
	FOREIGN KEY (`job_grade_id`) REFERENCES `job_grades`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organization_id`) REFERENCES `organizational_units`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_employees`("id", "job_grade_id", "lastPromotionDate", "organization_id", "is_manager", "code", "first_name", "last_name", "birth_date", "email", "phone_number", "status", "country", "state", "city", "line1", "line2", "postal_code", "remarks", "base_salary") SELECT "id", "job_grade_id", "lastPromotionDate", "organization_id", "is_manager", "code", "first_name", "last_name", "birth_date", "email", "phone_number", "status", "country", "state", "city", "line1", "line2", "postal_code", "remarks", "base_salary" FROM `employees`;--> statement-breakpoint
DROP TABLE `employees`;--> statement-breakpoint
ALTER TABLE `__new_employees` RENAME TO `employees`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `employees_code_unique` ON `employees` (`code`);--> statement-breakpoint
CREATE TABLE `__new_job_grades` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`position_id` integer NOT NULL,
	`level` text NOT NULL,
	`min_salary` integer NOT NULL,
	`max_salary` integer NOT NULL,
	`time_in_role` integer NOT NULL,
	`description` text,
	`headcount` integer,
	FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_job_grades`("id", "position_id", "level", "min_salary", "max_salary", "time_in_role", "description", "headcount") SELECT "id", "position_id", "level", "min_salary", "max_salary", "time_in_role", "description", "headcount" FROM `job_grades`;--> statement-breakpoint
DROP TABLE `job_grades`;--> statement-breakpoint
ALTER TABLE `__new_job_grades` RENAME TO `job_grades`;--> statement-breakpoint
CREATE UNIQUE INDEX `job_grades_position_id_level_unique` ON `job_grades` (`position_id`,`level`);