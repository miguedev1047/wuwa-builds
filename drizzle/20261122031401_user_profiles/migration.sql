CREATE TABLE `user_profiles` (
	`user_id` text PRIMARY KEY,
	`alias` text NOT NULL UNIQUE,
	`is_public` integer DEFAULT false NOT NULL,
	`game_server` text,
	`game_uid` text,
	`game_name` text,
	`photo_url` text,
	`thumbnail_url` text,
	CONSTRAINT `fk_user_profiles_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
