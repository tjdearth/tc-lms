-- Fix brand names: convert slugs to proper display names
-- Run this in Supabase SQL Editor

-- Calendar events
UPDATE calendar_events SET brand = 'Authenticus Italy' WHERE brand = 'authenticus_italy';
UPDATE calendar_events SET brand = 'Unbox Spain & Portugal' WHERE brand = 'unbox_spain_portugal';
UPDATE calendar_events SET brand = 'Truly Swahili' WHERE brand = 'truly_swahili';
UPDATE calendar_events SET brand = 'Across Mexico' WHERE brand = 'across_mexico';
UPDATE calendar_events SET brand = 'Kembali Indonesia' WHERE brand = 'kembali_indonesia';
UPDATE calendar_events SET brand = 'Majlis Retreats' WHERE brand = 'majlis_retreats';
UPDATE calendar_events SET brand = 'Crown Journey' WHERE brand = 'crown_journey';
UPDATE calendar_events SET brand = 'Oshinobi Travel' WHERE brand = 'oshinobi_travel';
UPDATE calendar_events SET brand = 'Essentially French' WHERE brand = 'essentially_french';
UPDATE calendar_events SET brand = 'Elura Australia' WHERE brand = 'elura_australia';
UPDATE calendar_events SET brand = 'Nira Thailand' WHERE brand = 'nira_thailand';
UPDATE calendar_events SET brand = 'Sar Turkiye' WHERE brand = 'sar_turkiye';
UPDATE calendar_events SET brand = 'Nostos Greece' WHERE brand = 'nostos_greece';
UPDATE calendar_events SET brand = 'Vista Colombia' WHERE brand = 'vista_colombia';
UPDATE calendar_events SET brand = 'Awaken Peru' WHERE brand = 'awaken_peru';
UPDATE calendar_events SET brand = 'Experience Morocco' WHERE brand = 'experience_morocco';

-- Wiki nodes (if any use slug-style brands)
UPDATE wiki_nodes SET brand = 'Salesforce Academy' WHERE brand = 'salesforce-academy';
UPDATE wiki_nodes SET brand = 'Travel Collection' WHERE brand = 'tc';
