CREATE TABLE `employees` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`job_grade_id` integer,
	`lastPromotionDate` integer NOT NULL,
	`organization_id` integer,
	`is_manager` integer DEFAULT false,
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
	FOREIGN KEY (`job_grade_id`) REFERENCES `job_grades`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organization_id`) REFERENCES `organizational_units`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `employees_code_unique` ON `employees` (`code`);