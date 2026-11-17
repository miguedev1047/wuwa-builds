CREATE TABLE `resonator_best_sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`resonator_id` integer NOT NULL,
	`set_id` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_resonator_best_sets_resonator_id_resonators_id_fk` FOREIGN KEY (`resonator_id`) REFERENCES `resonators`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_resonator_best_sets_set_id_sonata_sets_id_fk` FOREIGN KEY (`set_id`) REFERENCES `sonata_sets`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE UNIQUE INDEX `resonator_best_sets_resonator_set_idx` ON `resonator_best_sets` (`resonator_id`,`set_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `resonator_best_sets_resonator_order_idx` ON `resonator_best_sets` (`resonator_id`,`sort_order`);