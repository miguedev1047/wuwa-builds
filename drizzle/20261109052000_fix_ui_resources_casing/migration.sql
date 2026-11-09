UPDATE `resonators`
SET `icon` = replace(`icon`, '/UiResources/', '/UIResources/'),
	`card` = replace(`card`, '/UiResources/', '/UIResources/'),
	`icon_large` = replace(`icon_large`, '/UiResources/', '/UIResources/'),
	`circle` = replace(`circle`, '/UiResources/', '/UIResources/'),
	`portrait` = replace(`portrait`, '/UiResources/', '/UIResources/')
WHERE `icon` LIKE '%/UiResources/%'
	OR `card` LIKE '%/UiResources/%'
	OR `icon_large` LIKE '%/UiResources/%'
	OR `circle` LIKE '%/UiResources/%'
	OR `portrait` LIKE '%/UiResources/%';
--> statement-breakpoint
UPDATE `resonator_tags` SET `icon` = replace(`icon`, '/UiResources/', '/UIResources/') WHERE `icon` LIKE '%/UiResources/%';
--> statement-breakpoint
UPDATE `resonator_property_levels` SET `icon` = replace(`icon`, '/UiResources/', '/UIResources/') WHERE `icon` LIKE '%/UiResources/%';
--> statement-breakpoint
UPDATE `resonator_skills` SET `icon` = replace(`icon`, '/UiResources/', '/UIResources/') WHERE `icon` LIKE '%/UiResources/%';
--> statement-breakpoint
UPDATE `resonator_passives` SET `icon` = replace(`icon`, '/UiResources/', '/UIResources/') WHERE `icon` LIKE '%/UiResources/%';
--> statement-breakpoint
UPDATE `weapons` SET `icon` = replace(`icon`, '/UiResources/', '/UIResources/') WHERE `icon` LIKE '%/UiResources/%';
--> statement-breakpoint
UPDATE `weapon_properties` SET `icon` = replace(`icon`, '/UiResources/', '/UIResources/') WHERE `icon` LIKE '%/UiResources/%';
--> statement-breakpoint
UPDATE `echoes` SET `icon` = replace(`icon`, '/UiResources/', '/UIResources/') WHERE `icon` LIKE '%/UiResources/%';
--> statement-breakpoint
UPDATE `echo_sets` SET `icon` = replace(`icon`, '/UiResources/', '/UIResources/') WHERE `icon` LIKE '%/UiResources/%';
--> statement-breakpoint
UPDATE `echo_skills` SET `icon` = replace(`icon`, '/UiResources/', '/UIResources/') WHERE `icon` LIKE '%/UiResources/%';
--> statement-breakpoint
UPDATE `sonata_sets` SET `icon` = replace(`icon`, '/UiResources/', '/UIResources/') WHERE `icon` LIKE '%/UiResources/%';
