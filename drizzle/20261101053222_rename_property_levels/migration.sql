ALTER TABLE `resonator_properties` RENAME TO `resonator_property_levels`;--> statement-breakpoint
DROP INDEX IF EXISTS `resonator_properties_resonator_idx`;--> statement-breakpoint
CREATE INDEX `resonator_property_levels_resonator_idx` ON `resonator_property_levels` (`resonator_id`,`sort_order`);