CREATE TABLE `job_grades` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`position_id` integer,
	`level` text NOT NULL,
	`min_salary` integer NOT NULL,
	`max_salary` integer NOT NULL,
	`time_in_role` integer NOT NULL,
	`description` text,
	FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `job_grades_position_id_level_unique` ON `job_grades` (`position_id`,`level`);--> statement-breakpoint
CREATE TABLE `positions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `positions_code_unique` ON `positions` (`code`);
