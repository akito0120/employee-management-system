CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`performed_at` integer NOT NULL,
	`userId` integer NOT NULL,
	`category` text NOT NULL,
	`target` text,
	`targetId` integer,
	`old_value` text,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
