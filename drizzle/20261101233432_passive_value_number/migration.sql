ALTER TABLE `resonator_passives` RENAME COLUMN `description` TO `value_number`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_resonator_passives` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`resonator_id` integer NOT NULL,
	`passive_id` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`title` text DEFAULT '' NOT NULL,
	`value_number` real DEFAULT 0 NOT NULL,
	`icon` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_resonator_passives_resonator_id_resonators_id_fk` FOREIGN KEY (`resonator_id`) REFERENCES `resonators`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_resonator_passives`(`id`, `resonator_id`, `passive_id`, `sort_order`, `title`, `value_number`, `icon`, `created_at`, `updated_at`) SELECT `id`, `resonator_id`, `passive_id`, `sort_order`, `title`, `value_number`, `icon`, `created_at`, `updated_at` FROM `resonator_passives`;--> statement-breakpoint
DROP TABLE `resonator_passives`;--> statement-breakpoint
ALTER TABLE `__new_resonator_passives` RENAME TO `resonator_passives`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `resonator_passives_resonator_passive_idx` ON `resonator_passives` (`resonator_id`,`passive_id`);