ALTER TABLE `resonators` ADD `is_visible` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `resonators` ADD `is_new` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `resonators` ADD `is_collab` integer DEFAULT false NOT NULL;