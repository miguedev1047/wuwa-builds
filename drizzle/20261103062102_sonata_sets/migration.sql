CREATE TABLE `sonata_set_effects` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`set_id` integer NOT NULL,
	`pieces` integer NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`is_conditional` integer DEFAULT true NOT NULL,
	`stat_id` text,
	`value` real,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_sonata_set_effects_set_id_sonata_sets_id_fk` FOREIGN KEY (`set_id`) REFERENCES `sonata_sets`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `sonata_sets` (
	`id` integer PRIMARY KEY,
	`name` text NOT NULL,
	`icon` text DEFAULT '' NOT NULL,
	`color` text DEFAULT '' NOT NULL,
	`source` text DEFAULT 'encore' NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sonata_set_effects_set_pieces_idx` ON `sonata_set_effects` (`set_id`,`pieces`);