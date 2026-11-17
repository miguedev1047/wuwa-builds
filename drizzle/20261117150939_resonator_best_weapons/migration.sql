CREATE TABLE `resonator_best_weapons` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`resonator_id` integer NOT NULL,
	`weapon_id` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_resonator_best_weapons_resonator_id_resonators_id_fk` FOREIGN KEY (`resonator_id`) REFERENCES `resonators`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_resonator_best_weapons_weapon_id_weapons_id_fk` FOREIGN KEY (`weapon_id`) REFERENCES `weapons`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE UNIQUE INDEX `resonator_best_weapons_resonator_weapon_idx` ON `resonator_best_weapons` (`resonator_id`,`weapon_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `resonator_best_weapons_resonator_order_idx` ON `resonator_best_weapons` (`resonator_id`,`sort_order`);