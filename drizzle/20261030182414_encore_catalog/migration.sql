CREATE TABLE `echo_set_effects` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`set_id` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`key` integer NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_echo_set_effects_set_id_echo_sets_id_fk` FOREIGN KEY (`set_id`) REFERENCES `echo_sets`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `echo_sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`echo_id` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`set_id` integer DEFAULT 0 NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`icon` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_echo_sets_echo_id_echoes_id_fk` FOREIGN KEY (`echo_id`) REFERENCES `echoes`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `echo_skills` (
	`echo_id` integer PRIMARY KEY,
	`description` text DEFAULT '' NOT NULL,
	`cooldown` real DEFAULT 0 NOT NULL,
	`damage` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_echo_skills_echo_id_echoes_id_fk` FOREIGN KEY (`echo_id`) REFERENCES `echoes`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `echoes` (
	`id` integer PRIMARY KEY,
	`name` text NOT NULL,
	`rarity` integer DEFAULT 0 NOT NULL,
	`element` text DEFAULT '' NOT NULL,
	`icon` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `resonator_breaches` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`resonator_id` integer NOT NULL,
	`breach_id` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`level` integer DEFAULT 0 NOT NULL,
	`max_level` integer DEFAULT 0 NOT NULL,
	`items` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_resonator_breaches_resonator_id_resonators_id_fk` FOREIGN KEY (`resonator_id`) REFERENCES `resonators`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `resonator_passive_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`passive_id` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`key` integer NOT NULL,
	`value` integer NOT NULL,
	`icon` text DEFAULT '' NOT NULL,
	`quality` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_resonator_passive_items_passive_id_resonator_passives_id_fk` FOREIGN KEY (`passive_id`) REFERENCES `resonator_passives`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `resonator_passives` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`resonator_id` integer NOT NULL,
	`passive_id` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`title` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`icon` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_resonator_passives_resonator_id_resonators_id_fk` FOREIGN KEY (`resonator_id`) REFERENCES `resonators`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `resonator_properties` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`resonator_id` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`icon` text DEFAULT '' NOT NULL,
	`base_value` real DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_resonator_properties_resonator_id_resonators_id_fk` FOREIGN KEY (`resonator_id`) REFERENCES `resonators`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `resonator_property_growth` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`property_id` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`level` integer NOT NULL,
	`value_number` real,
	`value_text` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_resonator_property_growth_property_id_resonator_properties_id_fk` FOREIGN KEY (`property_id`) REFERENCES `resonator_properties`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `resonator_sequences` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`resonator_id` integer NOT NULL,
	`sequence_id` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`index` integer DEFAULT 0 NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_resonator_sequences_resonator_id_resonators_id_fk` FOREIGN KEY (`resonator_id`) REFERENCES `resonators`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `resonator_skill_attributes` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`skill_id` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`attribute_id` integer NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`values` text NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_resonator_skill_attributes_skill_id_resonator_skills_id_fk` FOREIGN KEY (`skill_id`) REFERENCES `resonator_skills`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `resonator_skills` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`resonator_id` integer NOT NULL,
	`skill_id` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`type` text DEFAULT '' NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`icon` text DEFAULT '' NOT NULL,
	`media` text DEFAULT '' NOT NULL,
	`consumes` text NOT NULL,
	`damage` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_resonator_skills_resonator_id_resonators_id_fk` FOREIGN KEY (`resonator_id`) REFERENCES `resonators`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `resonator_tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`resonator_id` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`color` text DEFAULT '' NOT NULL,
	`icon` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_resonator_tags_resonator_id_resonators_id_fk` FOREIGN KEY (`resonator_id`) REFERENCES `resonators`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `resonators` (
	`id` integer PRIMARY KEY,
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
CREATE TABLE `weapon_breaches` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`weapon_id` integer NOT NULL,
	`breach_id` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`level` integer DEFAULT 0 NOT NULL,
	`level_limit` integer DEFAULT 0 NOT NULL,
	`items` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_weapon_breaches_weapon_id_weapons_id_fk` FOREIGN KEY (`weapon_id`) REFERENCES `weapons`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `weapon_properties` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`weapon_id` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`icon` text DEFAULT '' NOT NULL,
	`base_value` real DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_weapon_properties_weapon_id_weapons_id_fk` FOREIGN KEY (`weapon_id`) REFERENCES `weapons`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `weapon_property_growth` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`property_id` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`level` integer NOT NULL,
	`value_number` real,
	`value_text` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_weapon_property_growth_property_id_weapon_properties_id_fk` FOREIGN KEY (`property_id`) REFERENCES `weapon_properties`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `weapons` (
	`id` integer PRIMARY KEY,
	`name` text NOT NULL,
	`rarity` integer DEFAULT 0 NOT NULL,
	`type` integer DEFAULT 0 NOT NULL,
	`type_name` text DEFAULT '' NOT NULL,
	`icon` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`effect` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `echo_set_effects_set_idx` ON `echo_set_effects` (`set_id`,`sort_order`);--> statement-breakpoint
CREATE UNIQUE INDEX `echo_sets_echo_set_idx` ON `echo_sets` (`echo_id`,`set_id`);--> statement-breakpoint
CREATE INDEX `echo_sets_set_idx` ON `echo_sets` (`set_id`);--> statement-breakpoint
CREATE INDEX `echoes_element_idx` ON `echoes` (`element`);--> statement-breakpoint
CREATE UNIQUE INDEX `resonator_breaches_resonator_breach_idx` ON `resonator_breaches` (`resonator_id`,`breach_id`);--> statement-breakpoint
CREATE INDEX `resonator_passive_items_passive_idx` ON `resonator_passive_items` (`passive_id`,`sort_order`);--> statement-breakpoint
CREATE UNIQUE INDEX `resonator_passives_resonator_passive_idx` ON `resonator_passives` (`resonator_id`,`passive_id`);--> statement-breakpoint
CREATE INDEX `resonator_properties_resonator_idx` ON `resonator_properties` (`resonator_id`,`sort_order`);--> statement-breakpoint
CREATE UNIQUE INDEX `resonator_property_growth_property_sort_idx` ON `resonator_property_growth` (`property_id`,`sort_order`);--> statement-breakpoint
CREATE UNIQUE INDEX `resonator_sequences_resonator_sequence_idx` ON `resonator_sequences` (`resonator_id`,`sequence_id`);--> statement-breakpoint
CREATE INDEX `resonator_skill_attributes_skill_idx` ON `resonator_skill_attributes` (`skill_id`,`sort_order`);--> statement-breakpoint
CREATE UNIQUE INDEX `resonator_skills_resonator_skill_idx` ON `resonator_skills` (`resonator_id`,`skill_id`);--> statement-breakpoint
CREATE INDEX `resonator_tags_resonator_idx` ON `resonator_tags` (`resonator_id`,`sort_order`);--> statement-breakpoint
CREATE INDEX `resonators_element_idx` ON `resonators` (`element`);--> statement-breakpoint
CREATE UNIQUE INDEX `weapon_breaches_weapon_breach_idx` ON `weapon_breaches` (`weapon_id`,`breach_id`);--> statement-breakpoint
CREATE INDEX `weapon_properties_weapon_idx` ON `weapon_properties` (`weapon_id`,`sort_order`);--> statement-breakpoint
CREATE UNIQUE INDEX `weapon_property_growth_property_sort_idx` ON `weapon_property_growth` (`property_id`,`sort_order`);--> statement-breakpoint
CREATE INDEX `weapons_type_idx` ON `weapons` (`type`);