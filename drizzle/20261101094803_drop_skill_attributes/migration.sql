DROP INDEX IF EXISTS `resonator_skill_attributes_skill_idx`;--> statement-breakpoint
DROP TABLE `resonator_skill_attributes`;--> statement-breakpoint
ALTER TABLE `resonator_skills` DROP COLUMN `consumes`;--> statement-breakpoint
ALTER TABLE `resonator_skills` DROP COLUMN `damage`;