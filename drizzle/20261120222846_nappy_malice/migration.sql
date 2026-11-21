PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_builds` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`character_id` integer,
	`name` text NOT NULL,
	`payload` text NOT NULL,
	`document_version` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_builds_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_builds`(`id`, `user_id`, `character_id`, `name`, `payload`, `document_version`, `created_at`, `updated_at`) SELECT `id`, `user_id`, `character_id`, `name`, `payload`, `document_version`, `created_at`, `updated_at` FROM `builds`;--> statement-breakpoint
DROP TABLE `builds`;--> statement-breakpoint
ALTER TABLE `__new_builds` RENAME TO `builds`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `builds_user_character_idx` ON `builds` (`user_id`,`character_id`,`updated_at`);--> statement-breakpoint
CREATE INDEX `builds_user_updated_idx` ON `builds` (`user_id`,`updated_at`);