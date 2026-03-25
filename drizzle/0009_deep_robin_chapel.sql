CREATE TABLE `rewards_and_disciplinary_actions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`employee_id` integer,
	`title` text,
	`description` text,
	`adjustment` integer,
	`issued_at` integer,
	`category` text,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
