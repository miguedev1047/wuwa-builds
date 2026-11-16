-- Validate every affected category before altering any catalog table.
CREATE TABLE IF NOT EXISTS __category_migration_guard (invalid_count integer CONSTRAINT known_categories_required CHECK (invalid_count = 0));
--> statement-breakpoint
INSERT INTO __category_migration_guard SELECT count(*) FROM (SELECT 'resonators' AS source, id, 'element' AS field, element AS value FROM resonators WHERE (element IS NULL OR CAST(element AS TEXT) NOT IN ('aero', 'Aero', 'havoc', 'Destrucción', 'electro', 'Electro', 'spectro', 'Espectro', 'fusion', 'Fusión', 'glacio', 'Gelio', 'Havoc', 'Spectro', 'Fusion', 'Glacio')));
--> statement-breakpoint
INSERT INTO __category_migration_guard SELECT count(*) FROM (SELECT 'resonators' AS source, id, 'weapon_type' AS field, weapon_type AS value FROM resonators WHERE (weapon_type IS NULL OR CAST(weapon_type AS TEXT) NOT IN ('broadblade', 'Mandoble', 'sword', 'Espada', 'pistols', 'Pistolas', 'gauntlets', 'Brazales', 'rectifier', 'Rectificador', '1', '2', '3', '4', '5', 'Broadblade', 'Sword', 'Pistols', 'Gauntlets', 'Rectifier', 'guantlets')));
--> statement-breakpoint
INSERT INTO __category_migration_guard SELECT count(*) FROM (SELECT 'weapons' AS source, id, 'type' AS field, type AS value FROM weapons WHERE (type IS NULL OR CAST(type AS TEXT) NOT IN ('broadblade', 'Mandoble', 'sword', 'Espada', 'pistols', 'Pistolas', 'gauntlets', 'Brazales', 'rectifier', 'Rectificador', '1', '2', '3', '4', '5', 'Broadblade', 'Sword', 'Pistols', 'Gauntlets', 'Rectifier', 'guantlets')));
--> statement-breakpoint
INSERT INTO __category_migration_guard SELECT count(*) FROM (SELECT 'echoes' AS source, id, 'class' AS field, class AS value FROM echoes WHERE (class IS NULL OR CAST(class AS TEXT) NOT IN ('common', 'Común', 'elite', 'Élite', 'boss', 'Jefe', 'calamity', 'Calamidad', '0', '1', '2', '3')));
--> statement-breakpoint
INSERT INTO __category_migration_guard SELECT count(*) FROM (SELECT 'resonators' AS source, id, 'rarity' AS field, rarity AS value FROM resonators WHERE rarity NOT IN (1,2,3,4,5));
--> statement-breakpoint
INSERT INTO __category_migration_guard SELECT count(*) FROM (SELECT 'weapons' AS source, id, 'rarity' AS field, rarity AS value FROM weapons WHERE rarity NOT IN (1,2,3,4,5));
--> statement-breakpoint
INSERT INTO __category_migration_guard SELECT count(*) FROM (SELECT 'echoes' AS source, id, 'cost' AS field, cost AS value FROM echoes WHERE cost NOT IN (1,3,4));
--> statement-breakpoint
INSERT INTO __category_migration_guard SELECT count(*) FROM (SELECT 'echo_skill_bonuses' AS source, id, 'condition_value' AS field, condition_value AS value FROM echo_skill_bonuses WHERE (condition = 'element' AND (condition_value IS NULL OR CAST(condition_value AS TEXT) NOT IN ('aero', 'Aero', 'havoc', 'Destrucción', 'electro', 'Electro', 'spectro', 'Espectro', 'fusion', 'Fusión', 'glacio', 'Gelio', 'Havoc', 'Spectro', 'Fusion', 'Glacio'))) OR (condition = 'weaponType' AND (condition_value IS NULL OR CAST(condition_value AS TEXT) NOT IN ('broadblade', 'Mandoble', 'sword', 'Espada', 'pistols', 'Pistolas', 'gauntlets', 'Brazales', 'rectifier', 'Rectificador', '1', '2', '3', '4', '5', 'Broadblade', 'Sword', 'Pistols', 'Gauntlets', 'Rectifier', 'guantlets'))));
--> statement-breakpoint
DROP TABLE __category_migration_guard;
--> statement-breakpoint
UPDATE resonators SET element = CASE CAST(element AS TEXT) WHEN 'aero' THEN 'aero' WHEN 'Aero' THEN 'aero' WHEN 'havoc' THEN 'havoc' WHEN 'Destrucción' THEN 'havoc' WHEN 'electro' THEN 'electro' WHEN 'Electro' THEN 'electro' WHEN 'spectro' THEN 'spectro' WHEN 'Espectro' THEN 'spectro' WHEN 'fusion' THEN 'fusion' WHEN 'Fusión' THEN 'fusion' WHEN 'glacio' THEN 'glacio' WHEN 'Gelio' THEN 'glacio' WHEN 'Havoc' THEN 'havoc' WHEN 'Spectro' THEN 'spectro' WHEN 'Fusion' THEN 'fusion' WHEN 'Glacio' THEN 'glacio' END, weapon_type = CASE CAST(weapon_type AS TEXT) WHEN 'broadblade' THEN 'broadblade' WHEN 'Mandoble' THEN 'broadblade' WHEN 'sword' THEN 'sword' WHEN 'Espada' THEN 'sword' WHEN 'pistols' THEN 'pistols' WHEN 'Pistolas' THEN 'pistols' WHEN 'gauntlets' THEN 'gauntlets' WHEN 'Brazales' THEN 'gauntlets' WHEN 'rectifier' THEN 'rectifier' WHEN 'Rectificador' THEN 'rectifier' WHEN '1' THEN 'broadblade' WHEN '2' THEN 'sword' WHEN '3' THEN 'pistols' WHEN '4' THEN 'gauntlets' WHEN '5' THEN 'rectifier' WHEN 'Broadblade' THEN 'broadblade' WHEN 'Sword' THEN 'sword' WHEN 'Pistols' THEN 'pistols' WHEN 'Gauntlets' THEN 'gauntlets' WHEN 'Rectifier' THEN 'rectifier' WHEN 'guantlets' THEN 'gauntlets' END;
--> statement-breakpoint
DROP INDEX weapons_type_idx;
--> statement-breakpoint
ALTER TABLE weapons ADD COLUMN __canonical_type text NOT NULL DEFAULT '';
--> statement-breakpoint
UPDATE weapons SET __canonical_type = CASE CAST(type AS TEXT) WHEN 'broadblade' THEN 'broadblade' WHEN 'Mandoble' THEN 'broadblade' WHEN 'sword' THEN 'sword' WHEN 'Espada' THEN 'sword' WHEN 'pistols' THEN 'pistols' WHEN 'Pistolas' THEN 'pistols' WHEN 'gauntlets' THEN 'gauntlets' WHEN 'Brazales' THEN 'gauntlets' WHEN 'rectifier' THEN 'rectifier' WHEN 'Rectificador' THEN 'rectifier' WHEN '1' THEN 'broadblade' WHEN '2' THEN 'sword' WHEN '3' THEN 'pistols' WHEN '4' THEN 'gauntlets' WHEN '5' THEN 'rectifier' WHEN 'Broadblade' THEN 'broadblade' WHEN 'Sword' THEN 'sword' WHEN 'Pistols' THEN 'pistols' WHEN 'Gauntlets' THEN 'gauntlets' WHEN 'Rectifier' THEN 'rectifier' WHEN 'guantlets' THEN 'gauntlets' END;
--> statement-breakpoint
ALTER TABLE weapons DROP COLUMN type;
--> statement-breakpoint
ALTER TABLE weapons RENAME COLUMN __canonical_type TO type;
--> statement-breakpoint
CREATE INDEX weapons_type_idx ON weapons (type);
--> statement-breakpoint
DROP INDEX echoes_class_idx;
--> statement-breakpoint
ALTER TABLE echoes ADD COLUMN __canonical_class text NOT NULL DEFAULT 'common';
--> statement-breakpoint
UPDATE echoes SET __canonical_class = CASE CAST(class AS TEXT) WHEN 'common' THEN 'common' WHEN 'Común' THEN 'common' WHEN 'elite' THEN 'elite' WHEN 'Élite' THEN 'elite' WHEN 'boss' THEN 'boss' WHEN 'Jefe' THEN 'boss' WHEN 'calamity' THEN 'calamity' WHEN 'Calamidad' THEN 'calamity' WHEN '0' THEN 'common' WHEN '1' THEN 'elite' WHEN '2' THEN 'boss' WHEN '3' THEN 'calamity' END;
--> statement-breakpoint
ALTER TABLE echoes DROP COLUMN class;
--> statement-breakpoint
ALTER TABLE echoes RENAME COLUMN __canonical_class TO class;
--> statement-breakpoint
CREATE INDEX echoes_class_idx ON echoes (class);
--> statement-breakpoint
ALTER TABLE weapons DROP COLUMN type_name;
--> statement-breakpoint
UPDATE echo_skill_bonuses SET condition_value = CASE CAST(condition_value AS TEXT) WHEN 'aero' THEN 'aero' WHEN 'Aero' THEN 'aero' WHEN 'havoc' THEN 'havoc' WHEN 'Destrucción' THEN 'havoc' WHEN 'electro' THEN 'electro' WHEN 'Electro' THEN 'electro' WHEN 'spectro' THEN 'spectro' WHEN 'Espectro' THEN 'spectro' WHEN 'fusion' THEN 'fusion' WHEN 'Fusión' THEN 'fusion' WHEN 'glacio' THEN 'glacio' WHEN 'Gelio' THEN 'glacio' WHEN 'Havoc' THEN 'havoc' WHEN 'Spectro' THEN 'spectro' WHEN 'Fusion' THEN 'fusion' WHEN 'Glacio' THEN 'glacio' END WHERE condition = 'element';
--> statement-breakpoint
UPDATE echo_skill_bonuses SET condition_value = CASE CAST(condition_value AS TEXT) WHEN 'broadblade' THEN 'broadblade' WHEN 'Mandoble' THEN 'broadblade' WHEN 'sword' THEN 'sword' WHEN 'Espada' THEN 'sword' WHEN 'pistols' THEN 'pistols' WHEN 'Pistolas' THEN 'pistols' WHEN 'gauntlets' THEN 'gauntlets' WHEN 'Brazales' THEN 'gauntlets' WHEN 'rectifier' THEN 'rectifier' WHEN 'Rectificador' THEN 'rectifier' WHEN '1' THEN 'broadblade' WHEN '2' THEN 'sword' WHEN '3' THEN 'pistols' WHEN '4' THEN 'gauntlets' WHEN '5' THEN 'rectifier' WHEN 'Broadblade' THEN 'broadblade' WHEN 'Sword' THEN 'sword' WHEN 'Pistols' THEN 'pistols' WHEN 'Gauntlets' THEN 'gauntlets' WHEN 'Rectifier' THEN 'rectifier' WHEN 'guantlets' THEN 'gauntlets' END WHERE condition = 'weaponType';
