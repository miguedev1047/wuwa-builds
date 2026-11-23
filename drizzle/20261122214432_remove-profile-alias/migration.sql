CREATE TABLE `__new_user_profiles` (
	`user_id` text PRIMARY KEY,
	`is_public` integer DEFAULT false NOT NULL,
	`game_server` text,
	`game_uid` text,
	`game_name` text,
	`photo_url` text,
	`thumbnail_url` text,
	CONSTRAINT `fk_user_profiles_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_user_profiles`(`user_id`, `is_public`, `game_server`, `game_uid`, `game_name`, `photo_url`, `thumbnail_url`) SELECT `user_id`, `is_public`, `game_server`, `game_uid`, `game_name`, `photo_url`, `thumbnail_url` FROM `user_profiles`;--> statement-breakpoint
DROP TABLE `user_profiles`;--> statement-breakpoint
ALTER TABLE `__new_user_profiles` RENAME TO `user_profiles`;
