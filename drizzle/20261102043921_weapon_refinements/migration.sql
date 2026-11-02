CREATE TABLE `weapon_refinement_stats` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`refinement_id` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`stat_name` text DEFAULT '' NOT NULL,
	`stat_number` real DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_weapon_refinement_stats_refinement_id_weapon_refinements_id_fk` FOREIGN KEY (`refinement_id`) REFERENCES `weapon_refinements`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `weapon_refinements` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`weapon_id` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`effect` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_weapon_refinements_weapon_id_weapons_id_fk` FOREIGN KEY (`weapon_id`) REFERENCES `weapons`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
DROP INDEX IF EXISTS `weapon_breaches_weapon_breach_idx`;--> statement-breakpoint
CREATE UNIQUE INDEX `weapon_refinement_stats_refinement_sort_idx` ON `weapon_refinement_stats` (`refinement_id`,`sort_order`);--> statement-breakpoint
CREATE UNIQUE INDEX `weapon_refinements_weapon_sort_idx` ON `weapon_refinements` (`weapon_id`,`sort_order`);--> statement-breakpoint
DROP TABLE `weapon_breaches`;--> statement-breakpoint
ALTER TABLE `weapons` DROP COLUMN `effect`;