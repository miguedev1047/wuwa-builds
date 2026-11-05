CREATE TABLE `echo_skill_bonuses` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`echo_id` integer NOT NULL,
	`stat_id` text NOT NULL,
	`value` real DEFAULT 0 NOT NULL,
	`requires_main_slot` integer DEFAULT false NOT NULL,
	`condition` text DEFAULT 'none' NOT NULL,
	`condition_value` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_echo_skill_bonuses_echo_id_echoes_id_fk` FOREIGN KEY (`echo_id`) REFERENCES `echoes`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
ALTER TABLE `echo_skills` ADD `simple_description` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `echo_skills` ADD `icon` text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE INDEX `echo_skill_bonuses_echo_sort_idx` ON `echo_skill_bonuses` (`echo_id`,`sort_order`);--> statement-breakpoint
ALTER TABLE `echo_skills` DROP COLUMN `cooldown`;--> statement-breakpoint
ALTER TABLE `echo_skills` DROP COLUMN `damage`;