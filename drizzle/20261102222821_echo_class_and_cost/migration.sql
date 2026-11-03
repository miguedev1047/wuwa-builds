ALTER TABLE `echoes` ADD `class` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `echoes` ADD `cost` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
DROP INDEX IF EXISTS `echoes_element_idx`;--> statement-breakpoint
CREATE INDEX `echoes_class_idx` ON `echoes` (`class`);--> statement-breakpoint
CREATE INDEX `echoes_cost_idx` ON `echoes` (`cost`);--> statement-breakpoint
ALTER TABLE `echoes` DROP COLUMN `element`;--> statement-breakpoint
ALTER TABLE `echoes` DROP COLUMN `description`;