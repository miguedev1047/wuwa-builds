ALTER TABLE `builds` ADD `character_id` integer NOT NULL;--> statement-breakpoint
DROP INDEX IF EXISTS `builds_user_resonator_idx`;--> statement-breakpoint
CREATE INDEX `builds_user_character_idx` ON `builds` (`user_id`,`character_id`,`updated_at`);--> statement-breakpoint
ALTER TABLE `builds` DROP COLUMN `resonator_slug`;