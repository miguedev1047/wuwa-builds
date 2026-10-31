PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_resonators` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`nickname` text DEFAULT '' NOT NULL,
	`introduction` text DEFAULT '' NOT NULL,
	`rarity` integer NOT NULL,
	`element` text DEFAULT '' NOT NULL,
	`weapon_type` text DEFAULT '' NOT NULL,
	`icon` text DEFAULT '' NOT NULL,
	`card` text DEFAULT '' NOT NULL,
	`icon_large` text DEFAULT '' NOT NULL,
	`circle` text DEFAULT '' NOT NULL,
	`portrait` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_resonators`(`id`, `name`, `nickname`, `introduction`, `rarity`, `element`, `weapon_type`, `icon`, `card`, `icon_large`, `circle`, `portrait`, `created_at`, `updated_at`) SELECT `id`, `name`, `nickname`, `introduction`, `rarity`, `element`, `weapon_type`, `icon`, `card`, `icon_large`, `circle`, `portrait`, `created_at`, `updated_at` FROM `resonators`;--> statement-breakpoint
DROP TABLE `resonators`;--> statement-breakpoint
ALTER TABLE `__new_resonators` RENAME TO `resonators`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `resonators_element_idx` ON `resonators` (`element`);