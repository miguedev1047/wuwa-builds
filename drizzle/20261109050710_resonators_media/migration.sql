CREATE TABLE `resonators_media` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`resonator_id` integer NOT NULL,
	`kind` text NOT NULL,
	`url` text DEFAULT '' NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_resonators_media_resonator_id_resonators_id_fk` FOREIGN KEY (`resonator_id`) REFERENCES `resonators`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE UNIQUE INDEX `resonators_media_resonator_kind_idx` ON `resonators_media` (`resonator_id`,`kind`);
--> statement-breakpoint
INSERT INTO `resonators_media` (`resonator_id`, `kind`, `url`, `sort_order`)
SELECT `id`, 'card', `card`, 0 FROM `resonators`
UNION ALL
SELECT `id`, 'icon', `icon`, 1 FROM `resonators`
UNION ALL
SELECT `id`, 'iconLarge', `icon_large`, 2 FROM `resonators`
UNION ALL
SELECT `id`, 'circle', `circle`, 3 FROM `resonators`
UNION ALL
SELECT `id`, 'portrait', `portrait`, 4 FROM `resonators`;