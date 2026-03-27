PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_rewards_and_disciplinary_actions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`adjustment` integer NOT NULL,
	`issued_at` integer NOT NULL,
	`category` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_rewards_and_disciplinary_actions`("id", "title", "description", "adjustment", "issued_at", "category") SELECT "id", "title", "description", "adjustment", "issued_at", "category" FROM `rewards_and_disciplinary_actions`;--> statement-breakpoint
DROP TABLE `rewards_and_disciplinary_actions`;--> statement-breakpoint
ALTER TABLE `__new_rewards_and_disciplinary_actions` RENAME TO `rewards_and_disciplinary_actions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;