-- Fix multi-day events missing date_end values
-- Run in Supabase SQL Editor

-- JAPAN
UPDATE calendar_events SET date_end = '2026-04-15' WHERE title = 'Cherry Blossom Season' AND date_start = '2026-03-25';
UPDATE calendar_events SET date_end = '2025-04-15' WHERE title = 'Cherry Blossom Season (Tokyo)' AND date_start = '2025-03-25';
UPDATE calendar_events SET date_end = '2025-05-05' WHERE title = 'Golden Week' AND date_start = '2025-04-29';
UPDATE calendar_events SET date_end = '2025-08-16' WHERE title = 'Obon' AND date_start = '2025-08-13';
UPDATE calendar_events SET date_end = '2025-07-31' WHERE title = 'Gion Matsuri' AND date_start = '2025-07-01';
UPDATE calendar_events SET date_end = '2025-12-05' WHERE title = 'Autumn Foliage Peak (Kyoto)' AND date_start = '2025-11-15';

-- ITALY
UPDATE calendar_events SET date_end = '2025-03-04' WHERE title = 'Venice Carnival' AND date_start = '2025-02-15';
UPDATE calendar_events SET date_end = '2025-09-06' WHERE title = 'Venice Film Festival' AND date_start = '2025-08-27';

-- SPAIN
UPDATE calendar_events SET date_end = '2025-07-14' WHERE title = 'San Fermin / Running of the Bulls' AND date_start = '2025-07-06';
UPDATE calendar_events SET date_end = '2025-03-19' WHERE title = 'Las Fallas' AND date_start = '2025-03-15';
UPDATE calendar_events SET date_end = '2025-04-19' WHERE title = 'Semana Santa' AND date_start = '2025-04-13';

-- EAST AFRICA
UPDATE calendar_events SET date_end = '2025-10-31' WHERE title = 'Great Wildebeest Migration (Masai Mara)' AND date_start = '2025-07-01';
UPDATE calendar_events SET date_end = '2025-03-31' WHERE title = 'Serengeti Wildebeest Calving Season' AND date_start = '2025-01-15';

-- MEXICO
UPDATE calendar_events SET date_end = '2025-11-02' WHERE title = 'Day of the Dead' AND date_start = '2025-11-01' AND brand = 'across_mexico';
UPDATE calendar_events SET date_end = '2026-11-02' WHERE title = 'Day of the Dead' AND date_start = '2026-11-01' AND brand = 'across_mexico';
UPDATE calendar_events SET date_end = '2025-03-04' WHERE title = 'Carnival (various cities)' AND date_start = '2025-02-28';

-- INDONESIA
UPDATE calendar_events SET date_end = '2025-07-12' WHERE title = 'Bali Arts Festival' AND date_start = '2025-06-14';

-- UAE
UPDATE calendar_events SET date_end = '2025-03-29' WHERE title = 'Ramadan (approximate start)' AND date_start = '2025-03-01' AND brand = 'majlis_retreats';
UPDATE calendar_events SET date_end = '2026-01-31' WHERE title = 'Dubai Shopping Festival' AND date_start = '2025-12-15';

-- UK
UPDATE calendar_events SET date_end = '2025-07-13' WHERE title = 'Wimbledon' AND date_start = '2025-06-30';
UPDATE calendar_events SET date_end = '2025-08-25' WHERE title = 'Edinburgh Fringe Festival' AND date_start = '2025-08-01';
UPDATE calendar_events SET date_end = '2025-08-25' WHERE title = 'Notting Hill Carnival' AND date_start = '2025-08-24';
UPDATE calendar_events SET date_end = '2025-06-29' WHERE title = 'Glastonbury Festival' AND date_start = '2025-06-25';

-- FRANCE
UPDATE calendar_events SET date_end = '2025-05-24' WHERE title = 'Cannes Film Festival' AND date_start = '2025-05-13';
UPDATE calendar_events SET date_end = '2025-07-27' WHERE title = 'Tour de France' AND date_start = '2025-07-05';
UPDATE calendar_events SET date_end = '2025-08-15' WHERE title = 'Lavender Season (Provence)' AND date_start = '2025-06-15';

-- AUSTRALIA
UPDATE calendar_events SET date_end = '2025-06-14' WHERE title = 'Vivid Sydney' AND date_start = '2025-05-23';
UPDATE calendar_events SET date_end = '2025-02-02' WHERE title = 'Australian Open' AND date_start = '2025-01-12';

-- THAILAND
UPDATE calendar_events SET date_end = '2025-04-15' WHERE title = 'Songkran' AND date_start = '2025-04-13' AND brand = 'nira_thailand';
UPDATE calendar_events SET date_end = '2026-04-15' WHERE title = 'Songkran' AND date_start = '2026-04-13' AND brand = 'nira_thailand';

-- TURKIYE
UPDATE calendar_events SET date_end = '2025-04-30' WHERE title = 'Istanbul Tulip Festival' AND date_start = '2025-04-01';
UPDATE calendar_events SET date_end = '2025-12-17' WHERE title = 'Whirling Dervish Festival (Konya)' AND date_start = '2025-12-07';
UPDATE calendar_events SET date_end = '2025-11-30' WHERE title = 'Cappadocia Hot Air Balloon Season' AND date_start = '2025-04-01';

-- GREECE
UPDATE calendar_events SET date_end = '2025-08-31' WHERE title = 'Athens Epidaurus Festival' AND date_start = '2025-06-01';
UPDATE calendar_events SET date_end = '2025-03-02' WHERE title = 'Carnival Season (Patras)' AND date_start = '2025-02-15';
UPDATE calendar_events SET date_end = '2025-08-31' WHERE title = 'Greek Island Peak Season' AND date_start = '2025-07-01';

-- COLOMBIA
UPDATE calendar_events SET date_end = '2025-03-04' WHERE title = 'Barranquilla Carnival' AND date_start = '2025-03-01';
UPDATE calendar_events SET date_end = '2026-02-17' WHERE title = 'Barranquilla Carnival' AND date_start = '2026-02-14';
UPDATE calendar_events SET date_end = '2025-08-10' WHERE title = 'Feria de las Flores (Medellin)' AND date_start = '2025-08-01';
UPDATE calendar_events SET date_end = '2025-12-30' WHERE title = 'Feria de Cali' AND date_start = '2025-12-25';

-- PERU
UPDATE calendar_events SET date_end = '2025-09-30' WHERE title = 'Machu Picchu Dry Season' AND date_start = '2025-05-01';

-- MOROCCO
UPDATE calendar_events SET date_end = '2025-03-29' WHERE title = 'Ramadan (approximate start)' AND date_start = '2025-03-01' AND brand = 'experience_morocco';
UPDATE calendar_events SET date_end = '2025-05-11' WHERE title = 'Rose Festival (Kelaa M''gouna)' AND date_start = '2025-05-09';
