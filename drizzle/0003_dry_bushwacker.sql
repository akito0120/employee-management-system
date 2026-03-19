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
CREATE UNIQUE INDEX `organizational_units_code_unique` ON `organizational_units` (`code`);