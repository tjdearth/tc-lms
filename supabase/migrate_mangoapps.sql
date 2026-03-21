-- MangoApps Migration: Auto-generated from learner CSV export
-- Generated: 2026-03-22 00:39
-- Users: 76
-- Enrollment records: 256

BEGIN;

-- ============================================
-- 1. INSERT LMS USERS (skip if already exists)
-- ============================================
INSERT INTO lms_users (email, name, brand) VALUES ('aakash@crownjourney.com', 'Aakash Vishwakarma', 'Crown Journey') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('aarav@crownjourney.com', 'Aarav Bhansali', 'Crown Journey') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('aaron@eluraaustralia.com', 'Aaron Hocking', 'Elura Australia') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('adelsia@travelcollection.co', 'Adelsia Pereira', 'Travel Collection') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('ana@acrossmexico.com', 'Ana Ruiz de la Peña', 'Across Mexico') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('aris@nostosgreece.com', 'Aris Mitropoulos', 'Nostos Greece') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('ashley@essentiallyfrench.com', 'Ashley MAUSSE', 'Essentially French') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('b.al-fatimi@experiencemorocco.com', 'Bouchra Alfatimi', 'Experience Morocco') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('caroline@trulyswahili.com', 'Caroline Silole', 'Truly Swahili') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('chloe@kembaliindonesia.com', 'Chloe Ong', 'Kembali Indonesia') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('christianna@nostosgreece.com', 'Christianna Panagopoulou', 'Nostos Greece') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('cintli@acrossmexico.com', 'Cintli Chacón', 'Across Mexico') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('constanza@unboxspain.com', 'Constanza Rico-Avello', 'Unbox Spain & Portugal') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('d.lamrani@experiencemorocco.com', 'Driss Lamrani', 'Experience Morocco') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('diane@acrossmexico.com', 'Diane Vazquez', 'Across Mexico') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('diego@awakenperu.com', 'Diego Nieto', 'Awaken Peru') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('eleonora@authenticusitaly.it', 'Eleonora Arrigoni', 'Authenticus Italy') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('elisa.butta@authenticusitaly.it', 'Elisa Buttà', 'Authenticus Italy') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('elisa.liotta@authenticusitaly.it', 'Elisa Liotta', 'Authenticus Italy') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('elisa@authenticusitaly.it', 'Elisa Sciabica', 'Authenticus Italy') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('ellen@oshinobitravel.com', 'Ellen Yokoyama', 'Oshinobi Travel') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('emi@oshinobitravel.com', 'Emi Matsuda', 'Oshinobi Travel') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('f.akbouche@experiencemorocco.com', 'FAYCAL AKBOUCHE', 'Experience Morocco') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('f.mouttaki@experiencemorocco.com', 'FZ Mouttaki', 'Experience Morocco') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('f.rachid@experiencemorocco.com', 'Fahd Rachid', 'Experience Morocco') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('fred@trulyswahili.com', 'Fred Wasswa', 'Truly Swahili') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('g.chaibi@experiencemorocco.com', 'Ghizlane Chaibi', 'Experience Morocco') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('gabriele@authenticusitaly.it', 'Gabriele Giraudo', 'Authenticus Italy') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('giulia@authenticusitaly.it', 'Giulia Catalano', 'Authenticus Italy') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('giulia@travelcollection.co', 'Giulia Marri', 'Travel Collection') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('gruenzig-sugiya@oshinobitravel.com', 'Gruenzig-Sugiya Peter', 'Oshinobi Travel') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('h.el-iklil@experiencemorocco.com', 'Hiba El Iklil', 'Experience Morocco') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('hajar@experiencemorocco.com', 'Hajar', 'Experience Morocco') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('hazan@sarturkiye.com', 'Hazan Sucu', 'Sar Turkiye') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('hicham@experiencemorocco.com', 'Hicham Alaoui', 'Experience Morocco') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('hiroshi@oshinobitravel.com', 'Hiroshi Tsuji', 'Oshinobi Travel') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('ihab@travelcollection.co', 'Ihab El Alami', 'Travel Collection') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('ingrid@acrossmexico.com', 'Ingrid Dabbah', 'Across Mexico') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('innocent@travelcollection.co', 'Toua Innocent TIA', 'Travel Collection') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('javier@unboxspain.com', 'Javier Saiz', 'Unbox Spain & Portugal') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('juan@unboxspain.com', 'Juan Gonzalez', 'Unbox Spain & Portugal') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('karen@crownjourney.com', 'Karen Gee', 'Crown Journey') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('kavya@crownjourney.com', 'Kavya Singh', 'Crown Journey') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('l.ait-elmahjoub@experiencemorocco.com', 'LAILA AIT EL MAHJOUB', 'Experience Morocco') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('lamia.elakkad@experiencemorocco.com', 'Lamiaa Elakkad', 'Experience Morocco') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('liorah@essentiallyfrench.com', 'Liorah MORARD', 'Essentially French') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('lucia@unboxspain.com', 'Lucia Arroyo', 'Unbox Spain & Portugal') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('ludivine@essentiallyfrench.com', 'Ludivine VINCENT', 'Essentially French') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('luky@kembaliindonesia.com', 'luky kristiani', 'Kembali Indonesia') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('m.akhrif@experiencemorocco.com', 'Mariem Akhrif', 'Experience Morocco') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('mako@oshinobitravel.com', 'Mako Ishio', 'Oshinobi Travel') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('maria@authenticusitaly.it', 'Maria Pagano', 'Authenticus Italy') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('martafc@unboxspain.com', 'Marta  Fernandez Cruz', 'Unbox Spain & Portugal') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('martina@authenticusitaly.it', 'Martina Venturi', 'Authenticus Italy') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('maryama@experiencemorocco.com', 'Maryama Eladama', 'Experience Morocco') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('mayuno@oshinobitravel.com', 'Mayuno Kadoshima', 'Oshinobi Travel') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('melvin@trulyswahili.com', 'Melvin Mapetla', 'Truly Swahili') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('milena@travelcollection.co', 'Milena Stancati', 'Travel Collection') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('mustafa@kembaliindonesia.com', 'Mustafa Koyuncu', 'Kembali Indonesia') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('nick@nirathailand.com', 'Nick Sakunworaratana', 'Nira Thailand') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('paras@travelcollection.co', 'Paras Dedhia', 'Travel Collection') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('r.chandour@experiencemorocco.com', 'Rim Chandour', 'Experience Morocco') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('radia@majlisretreats.com', 'Radia Tehitahe', 'Majlis Retreats') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('s.baljid@experiencemorocco.com', 'S Baljid', 'Experience Morocco') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('s.laghribi@experiencemorocco.com', 'Sara Laghribi', 'Experience Morocco') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('salima@experiencemorocco.com', 'Salima Sayed', 'Experience Morocco') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('sami@travelcollection.co', 'Sami Aazmi', 'Travel Collection') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('santiago@vistacolombia.com', 'Santiago Sabogal', 'Vista Colombia') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('stephan@trulyswahili.com', 'Stephan Meyer - Beunau', 'Truly Swahili') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('takae@oshinobitravel.com', 'Takae Kogure', 'Oshinobi Travel') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('thami@travelcollection.co', 'Thami Memel', 'Travel Collection') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('tucker@travelcollection.co', 'Tucker Dearth', 'Travel Collection') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('valerios@nostosgreece.com', 'Valerios Livadaru', 'Nostos Greece') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('vania@acrossmexico.com', 'Vania Beltran', 'Across Mexico') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('wahlquist@oshinobitravel.com', 'Wahlquist Joachim', 'Oshinobi Travel') ON CONFLICT (email) DO NOTHING;
INSERT INTO lms_users (email, name, brand) VALUES ('z.talmzi@experiencemorocco.com', 'Zainab Talmzi', 'Experience Morocco') ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 2. INSERT ENROLLMENTS + LESSON PROGRESS
-- ============================================

-- aakash@crownjourney.com -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-18', '2026-02-18' FROM lms_users u, courses c WHERE u.email = 'aakash@crownjourney.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-18', '2026-02-18' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aakash@crownjourney.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aakash@crownjourney.com -> SFAC02 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-18', '2026-02-18' FROM lms_users u, courses c WHERE u.email = 'aakash@crownjourney.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-18', '2026-02-18' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aakash@crownjourney.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aakash@crownjourney.com -> SFAC03 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-18', '2026-02-19' FROM lms_users u, courses c WHERE u.email = 'aakash@crownjourney.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-18', '2026-02-19' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aakash@crownjourney.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aakash@crownjourney.com -> SFAC04 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-19', '2026-02-19' FROM lms_users u, courses c WHERE u.email = 'aakash@crownjourney.com' AND c.code = 'SFAC04' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-19', '2026-02-19' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aakash@crownjourney.com' AND c.code = 'SFAC04' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aakash@crownjourney.com -> SFAC05 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-19', '2026-02-19' FROM lms_users u, courses c WHERE u.email = 'aakash@crownjourney.com' AND c.code = 'SFAC05' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-19', '2026-02-19' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aakash@crownjourney.com' AND c.code = 'SFAC05' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aakash@crownjourney.com -> SFAC06 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-19', '2026-02-19' FROM lms_users u, courses c WHERE u.email = 'aakash@crownjourney.com' AND c.code = 'SFAC06' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-19', '2026-02-19' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aakash@crownjourney.com' AND c.code = 'SFAC06' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aakash@crownjourney.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-17', '2026-02-17' FROM lms_users u, courses c WHERE u.email = 'aakash@crownjourney.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-17', '2026-02-17' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aakash@crownjourney.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aakash@crownjourney.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-17', '2026-02-17' FROM lms_users u, courses c WHERE u.email = 'aakash@crownjourney.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-17', '2026-02-17' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aakash@crownjourney.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aakash@crownjourney.com -> TraAdv2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-18', '2026-02-18' FROM lms_users u, courses c WHERE u.email = 'aakash@crownjourney.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-18', '2026-02-18' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aakash@crownjourney.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aakash@crownjourney.com -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-17', '2026-02-18' FROM lms_users u, courses c WHERE u.email = 'aakash@crownjourney.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-17', '2026-02-18' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aakash@crownjourney.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aarav@crownjourney.com -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-10-29', '2025-10-29' FROM lms_users u, courses c WHERE u.email = 'aarav@crownjourney.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-10-29', '2025-10-29' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aarav@crownjourney.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aarav@crownjourney.com -> SFAC02 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-10-29', '2025-10-30' FROM lms_users u, courses c WHERE u.email = 'aarav@crownjourney.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-10-29', '2025-10-30' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aarav@crownjourney.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aarav@crownjourney.com -> SFAC03 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-10-30', '2025-10-30' FROM lms_users u, courses c WHERE u.email = 'aarav@crownjourney.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-10-30', '2025-10-30' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aarav@crownjourney.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aarav@crownjourney.com -> SFAC04 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-10-30', '2025-10-30' FROM lms_users u, courses c WHERE u.email = 'aarav@crownjourney.com' AND c.code = 'SFAC04' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-10-30', '2025-10-30' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aarav@crownjourney.com' AND c.code = 'SFAC04' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aarav@crownjourney.com -> SFAC05 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-10-30', '2025-10-30' FROM lms_users u, courses c WHERE u.email = 'aarav@crownjourney.com' AND c.code = 'SFAC05' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-10-30', '2025-10-30' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aarav@crownjourney.com' AND c.code = 'SFAC05' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aarav@crownjourney.com -> SFAC06 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-10-30', '2025-10-30' FROM lms_users u, courses c WHERE u.email = 'aarav@crownjourney.com' AND c.code = 'SFAC06' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-10-30', '2025-10-30' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aarav@crownjourney.com' AND c.code = 'SFAC06' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aarav@crownjourney.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-10-27', '2025-10-27' FROM lms_users u, courses c WHERE u.email = 'aarav@crownjourney.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-10-27', '2025-10-27' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aarav@crownjourney.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aarav@crownjourney.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-10-27', '2025-10-28' FROM lms_users u, courses c WHERE u.email = 'aarav@crownjourney.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-10-27', '2025-10-28' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aarav@crownjourney.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aarav@crownjourney.com -> TraAdv2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-10-29', '2025-10-29' FROM lms_users u, courses c WHERE u.email = 'aarav@crownjourney.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-10-29', '2025-10-29' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aarav@crownjourney.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aarav@crownjourney.com -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-10-28', '2025-10-29' FROM lms_users u, courses c WHERE u.email = 'aarav@crownjourney.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-10-28', '2025-10-29' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aarav@crownjourney.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aaron@eluraaustralia.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-08', '2025-07-13' FROM lms_users u, courses c WHERE u.email = 'aaron@eluraaustralia.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-08', '2025-07-13' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aaron@eluraaustralia.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aaron@eluraaustralia.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-13', '2025-07-14' FROM lms_users u, courses c WHERE u.email = 'aaron@eluraaustralia.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-13', '2025-07-14' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aaron@eluraaustralia.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- adelsia@travelcollection.co -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-02', '2025-07-09' FROM lms_users u, courses c WHERE u.email = 'adelsia@travelcollection.co' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-02', '2025-07-09' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'adelsia@travelcollection.co' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- adelsia@travelcollection.co -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-07', '2025-07-08' FROM lms_users u, courses c WHERE u.email = 'adelsia@travelcollection.co' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-07', '2025-07-08' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'adelsia@travelcollection.co' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- adelsia@travelcollection.co -> TCL2 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-07-08', NULL FROM lms_users u, courses c WHERE u.email = 'adelsia@travelcollection.co' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- ana@acrossmexico.com -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-10', '2026-02-11' FROM lms_users u, courses c WHERE u.email = 'ana@acrossmexico.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-10', '2026-02-11' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ana@acrossmexico.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ana@acrossmexico.com -> SFAC02 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-12', '2026-02-12' FROM lms_users u, courses c WHERE u.email = 'ana@acrossmexico.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-12', '2026-02-12' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ana@acrossmexico.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ana@acrossmexico.com -> SFAC03 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-12', '2026-02-13' FROM lms_users u, courses c WHERE u.email = 'ana@acrossmexico.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-12', '2026-02-13' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ana@acrossmexico.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ana@acrossmexico.com -> SFAC04 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2026-02-13', NULL FROM lms_users u, courses c WHERE u.email = 'ana@acrossmexico.com' AND c.code = 'SFAC04' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- ana@acrossmexico.com -> SFAC05 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2026-03-06', NULL FROM lms_users u, courses c WHERE u.email = 'ana@acrossmexico.com' AND c.code = 'SFAC05' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- ana@acrossmexico.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-11', '2026-02-11' FROM lms_users u, courses c WHERE u.email = 'ana@acrossmexico.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-11', '2026-02-11' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ana@acrossmexico.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ana@acrossmexico.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-11', '2026-02-11' FROM lms_users u, courses c WHERE u.email = 'ana@acrossmexico.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-11', '2026-02-11' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ana@acrossmexico.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ana@acrossmexico.com -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-11', '2026-02-12' FROM lms_users u, courses c WHERE u.email = 'ana@acrossmexico.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-11', '2026-02-12' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ana@acrossmexico.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aris@nostosgreece.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-08', '2025-07-08' FROM lms_users u, courses c WHERE u.email = 'aris@nostosgreece.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-08', '2025-07-08' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aris@nostosgreece.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aris@nostosgreece.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-08', '2025-07-11' FROM lms_users u, courses c WHERE u.email = 'aris@nostosgreece.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-08', '2025-07-11' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'aris@nostosgreece.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- aris@nostosgreece.com -> TraAdv3 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2026-03-02', NULL FROM lms_users u, courses c WHERE u.email = 'aris@nostosgreece.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- ashley@essentiallyfrench.com -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-11-18', '2025-11-18' FROM lms_users u, courses c WHERE u.email = 'ashley@essentiallyfrench.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-11-18', '2025-11-18' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ashley@essentiallyfrench.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- b.al-fatimi@experiencemorocco.com -> TCL1 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-02-13', NULL FROM lms_users u, courses c WHERE u.email = 'b.al-fatimi@experiencemorocco.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- caroline@trulyswahili.com -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-03-11', '2026-03-13' FROM lms_users u, courses c WHERE u.email = 'caroline@trulyswahili.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-03-11', '2026-03-13' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'caroline@trulyswahili.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- caroline@trulyswahili.com -> SFAC02 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-03-13', '2026-03-14' FROM lms_users u, courses c WHERE u.email = 'caroline@trulyswahili.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-03-13', '2026-03-14' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'caroline@trulyswahili.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- caroline@trulyswahili.com -> SFAC03 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2026-03-14', NULL FROM lms_users u, courses c WHERE u.email = 'caroline@trulyswahili.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- caroline@trulyswahili.com -> SFAC05 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2026-03-16', NULL FROM lms_users u, courses c WHERE u.email = 'caroline@trulyswahili.com' AND c.code = 'SFAC05' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- caroline@trulyswahili.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-03-11', '2026-03-11' FROM lms_users u, courses c WHERE u.email = 'caroline@trulyswahili.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-03-11', '2026-03-11' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'caroline@trulyswahili.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- caroline@trulyswahili.com -> TraAdv3 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2026-03-20', NULL FROM lms_users u, courses c WHERE u.email = 'caroline@trulyswahili.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- chloe@kembaliindonesia.com -> TCL1 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2024-12-09', NULL FROM lms_users u, courses c WHERE u.email = 'chloe@kembaliindonesia.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- christianna@nostosgreece.com -> BPG02 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2026-03-10', NULL FROM lms_users u, courses c WHERE u.email = 'christianna@nostosgreece.com' AND c.code = 'BPG02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- christianna@nostosgreece.com -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-03-02', '2026-03-02' FROM lms_users u, courses c WHERE u.email = 'christianna@nostosgreece.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-03-02', '2026-03-02' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'christianna@nostosgreece.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- christianna@nostosgreece.com -> SFAC02 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-03-02', '2026-03-02' FROM lms_users u, courses c WHERE u.email = 'christianna@nostosgreece.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-03-02', '2026-03-02' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'christianna@nostosgreece.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- christianna@nostosgreece.com -> SFAC03 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-03-10', '2026-03-10' FROM lms_users u, courses c WHERE u.email = 'christianna@nostosgreece.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-03-10', '2026-03-10' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'christianna@nostosgreece.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- christianna@nostosgreece.com -> SFAC04 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-03-10', '2026-03-10' FROM lms_users u, courses c WHERE u.email = 'christianna@nostosgreece.com' AND c.code = 'SFAC04' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-03-10', '2026-03-10' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'christianna@nostosgreece.com' AND c.code = 'SFAC04' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- christianna@nostosgreece.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-24', '2026-02-25' FROM lms_users u, courses c WHERE u.email = 'christianna@nostosgreece.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-24', '2026-02-25' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'christianna@nostosgreece.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- christianna@nostosgreece.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-24', '2026-02-27' FROM lms_users u, courses c WHERE u.email = 'christianna@nostosgreece.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-24', '2026-02-27' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'christianna@nostosgreece.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- christianna@nostosgreece.com -> TraAdv2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-27', '2026-02-27' FROM lms_users u, courses c WHERE u.email = 'christianna@nostosgreece.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-27', '2026-02-27' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'christianna@nostosgreece.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- christianna@nostosgreece.com -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-27', '2026-03-02' FROM lms_users u, courses c WHERE u.email = 'christianna@nostosgreece.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-27', '2026-03-02' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'christianna@nostosgreece.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- cintli@acrossmexico.com -> TraAdv3 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-10-31', NULL FROM lms_users u, courses c WHERE u.email = 'cintli@acrossmexico.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- constanza@unboxspain.com -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-04-21', '2025-04-21' FROM lms_users u, courses c WHERE u.email = 'constanza@unboxspain.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-04-21', '2025-04-21' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'constanza@unboxspain.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- constanza@unboxspain.com -> SFAC02 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-04-21', NULL FROM lms_users u, courses c WHERE u.email = 'constanza@unboxspain.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- constanza@unboxspain.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2024-12-09', '2025-01-10' FROM lms_users u, courses c WHERE u.email = 'constanza@unboxspain.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2024-12-09', '2025-01-10' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'constanza@unboxspain.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- constanza@unboxspain.com -> TraAdv2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-01-20', '2025-01-23' FROM lms_users u, courses c WHERE u.email = 'constanza@unboxspain.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-01-20', '2025-01-23' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'constanza@unboxspain.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- constanza@unboxspain.com -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-10-13', '2025-10-13' FROM lms_users u, courses c WHERE u.email = 'constanza@unboxspain.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-10-13', '2025-10-13' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'constanza@unboxspain.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- d.lamrani@experiencemorocco.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2024-12-17', '2024-12-25' FROM lms_users u, courses c WHERE u.email = 'd.lamrani@experiencemorocco.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2024-12-17', '2024-12-25' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'd.lamrani@experiencemorocco.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- diane@acrossmexico.com -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-05-05', '2025-05-05' FROM lms_users u, courses c WHERE u.email = 'diane@acrossmexico.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-05-05', '2025-05-05' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'diane@acrossmexico.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- diane@acrossmexico.com -> SFAC02 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-05-09', '2025-05-09' FROM lms_users u, courses c WHERE u.email = 'diane@acrossmexico.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-05-09', '2025-05-09' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'diane@acrossmexico.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- diane@acrossmexico.com -> SFAC03 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-05-10', '2025-05-10' FROM lms_users u, courses c WHERE u.email = 'diane@acrossmexico.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-05-10', '2025-05-10' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'diane@acrossmexico.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- diane@acrossmexico.com -> SFAC05 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-05-12', '2025-05-12' FROM lms_users u, courses c WHERE u.email = 'diane@acrossmexico.com' AND c.code = 'SFAC05' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-05-12', '2025-05-12' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'diane@acrossmexico.com' AND c.code = 'SFAC05' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- diane@acrossmexico.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-05-02', '2025-05-02' FROM lms_users u, courses c WHERE u.email = 'diane@acrossmexico.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-05-02', '2025-05-02' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'diane@acrossmexico.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- diane@acrossmexico.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-05-03', '2025-05-03' FROM lms_users u, courses c WHERE u.email = 'diane@acrossmexico.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-05-03', '2025-05-03' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'diane@acrossmexico.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- diane@acrossmexico.com -> TraAdv2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-05-05', '2025-05-09' FROM lms_users u, courses c WHERE u.email = 'diane@acrossmexico.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-05-05', '2025-05-09' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'diane@acrossmexico.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- diane@acrossmexico.com -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-10-15', '2025-10-31' FROM lms_users u, courses c WHERE u.email = 'diane@acrossmexico.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-10-15', '2025-10-31' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'diane@acrossmexico.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- diego@awakenperu.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-06-03', '2025-07-14' FROM lms_users u, courses c WHERE u.email = 'diego@awakenperu.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-06-03', '2025-07-14' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'diego@awakenperu.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- diego@awakenperu.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-14', '2025-07-14' FROM lms_users u, courses c WHERE u.email = 'diego@awakenperu.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-14', '2025-07-14' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'diego@awakenperu.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- diego@awakenperu.com -> TraAdv2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-14', '2025-07-15' FROM lms_users u, courses c WHERE u.email = 'diego@awakenperu.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-14', '2025-07-15' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'diego@awakenperu.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- eleonora@authenticusitaly.it -> TCL1 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2024-12-10', NULL FROM lms_users u, courses c WHERE u.email = 'eleonora@authenticusitaly.it' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- eleonora@authenticusitaly.it -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-10-28', '2025-10-29' FROM lms_users u, courses c WHERE u.email = 'eleonora@authenticusitaly.it' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-10-28', '2025-10-29' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'eleonora@authenticusitaly.it' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- elisa.butta@authenticusitaly.it -> TCL1 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2024-12-10', NULL FROM lms_users u, courses c WHERE u.email = 'elisa.butta@authenticusitaly.it' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- elisa.liotta@authenticusitaly.it -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-12-09', '2025-12-09' FROM lms_users u, courses c WHERE u.email = 'elisa.liotta@authenticusitaly.it' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-12-09', '2025-12-09' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'elisa.liotta@authenticusitaly.it' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- elisa.liotta@authenticusitaly.it -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-11-06', '2025-11-10' FROM lms_users u, courses c WHERE u.email = 'elisa.liotta@authenticusitaly.it' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-11-06', '2025-11-10' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'elisa.liotta@authenticusitaly.it' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- elisa.liotta@authenticusitaly.it -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-11-10', '2025-11-10' FROM lms_users u, courses c WHERE u.email = 'elisa.liotta@authenticusitaly.it' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-11-10', '2025-11-10' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'elisa.liotta@authenticusitaly.it' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- elisa.liotta@authenticusitaly.it -> TraAdv2 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-11-10', NULL FROM lms_users u, courses c WHERE u.email = 'elisa.liotta@authenticusitaly.it' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- elisa@authenticusitaly.it -> TraAdv2 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-02-13', NULL FROM lms_users u, courses c WHERE u.email = 'elisa@authenticusitaly.it' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- elisa@authenticusitaly.it -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-19', '2025-09-22' FROM lms_users u, courses c WHERE u.email = 'elisa@authenticusitaly.it' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-19', '2025-09-22' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'elisa@authenticusitaly.it' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ellen@oshinobitravel.com -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-10-01', '2025-10-14' FROM lms_users u, courses c WHERE u.email = 'ellen@oshinobitravel.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-10-01', '2025-10-14' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ellen@oshinobitravel.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ellen@oshinobitravel.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-08', '2025-09-12' FROM lms_users u, courses c WHERE u.email = 'ellen@oshinobitravel.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-08', '2025-09-12' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ellen@oshinobitravel.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ellen@oshinobitravel.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-16', '2025-09-16' FROM lms_users u, courses c WHERE u.email = 'ellen@oshinobitravel.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-16', '2025-09-16' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ellen@oshinobitravel.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ellen@oshinobitravel.com -> TraAdv2 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-09-08', NULL FROM lms_users u, courses c WHERE u.email = 'ellen@oshinobitravel.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- ellen@oshinobitravel.com -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-10-01', '2025-10-01' FROM lms_users u, courses c WHERE u.email = 'ellen@oshinobitravel.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-10-01', '2025-10-01' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ellen@oshinobitravel.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- emi@oshinobitravel.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2024-12-07', '2024-12-19' FROM lms_users u, courses c WHERE u.email = 'emi@oshinobitravel.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2024-12-07', '2024-12-19' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'emi@oshinobitravel.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- emi@oshinobitravel.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2024-12-19', '2024-12-21' FROM lms_users u, courses c WHERE u.email = 'emi@oshinobitravel.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2024-12-19', '2024-12-21' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'emi@oshinobitravel.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- f.akbouche@experiencemorocco.com -> TCL2 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-02-11', NULL FROM lms_users u, courses c WHERE u.email = 'f.akbouche@experiencemorocco.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- f.mouttaki@experiencemorocco.com -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-11-14', '2025-11-14' FROM lms_users u, courses c WHERE u.email = 'f.mouttaki@experiencemorocco.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-11-14', '2025-11-14' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'f.mouttaki@experiencemorocco.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- f.mouttaki@experiencemorocco.com -> SFAC02 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-11-14', '2025-11-14' FROM lms_users u, courses c WHERE u.email = 'f.mouttaki@experiencemorocco.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-11-14', '2025-11-14' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'f.mouttaki@experiencemorocco.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- f.mouttaki@experiencemorocco.com -> SFAC03 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-11-14', '2025-11-14' FROM lms_users u, courses c WHERE u.email = 'f.mouttaki@experiencemorocco.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-11-14', '2025-11-14' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'f.mouttaki@experiencemorocco.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- f.mouttaki@experiencemorocco.com -> SFAC04 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-11-14', '2025-11-14' FROM lms_users u, courses c WHERE u.email = 'f.mouttaki@experiencemorocco.com' AND c.code = 'SFAC04' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-11-14', '2025-11-14' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'f.mouttaki@experiencemorocco.com' AND c.code = 'SFAC04' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- f.mouttaki@experiencemorocco.com -> SFAC05 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-11-14', NULL FROM lms_users u, courses c WHERE u.email = 'f.mouttaki@experiencemorocco.com' AND c.code = 'SFAC05' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- f.rachid@experiencemorocco.com -> TCL1 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2024-12-16', NULL FROM lms_users u, courses c WHERE u.email = 'f.rachid@experiencemorocco.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- fred@trulyswahili.com -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-06-30', '2025-06-30' FROM lms_users u, courses c WHERE u.email = 'fred@trulyswahili.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-06-30', '2025-06-30' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'fred@trulyswahili.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- fred@trulyswahili.com -> SFAC02 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-06-30', '2025-07-08' FROM lms_users u, courses c WHERE u.email = 'fred@trulyswahili.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-06-30', '2025-07-08' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'fred@trulyswahili.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- fred@trulyswahili.com -> SFAC03 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-14', '2025-07-15' FROM lms_users u, courses c WHERE u.email = 'fred@trulyswahili.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-14', '2025-07-15' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'fred@trulyswahili.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- fred@trulyswahili.com -> SFAC04 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-16', '2025-07-16' FROM lms_users u, courses c WHERE u.email = 'fred@trulyswahili.com' AND c.code = 'SFAC04' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-16', '2025-07-16' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'fred@trulyswahili.com' AND c.code = 'SFAC04' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- fred@trulyswahili.com -> SFAC05 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-16', '2025-07-17' FROM lms_users u, courses c WHERE u.email = 'fred@trulyswahili.com' AND c.code = 'SFAC05' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-16', '2025-07-17' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'fred@trulyswahili.com' AND c.code = 'SFAC05' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- fred@trulyswahili.com -> SFAC06 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-17', '2025-07-17' FROM lms_users u, courses c WHERE u.email = 'fred@trulyswahili.com' AND c.code = 'SFAC06' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-17', '2025-07-17' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'fred@trulyswahili.com' AND c.code = 'SFAC06' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- fred@trulyswahili.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-06-24', '2025-06-25' FROM lms_users u, courses c WHERE u.email = 'fred@trulyswahili.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-06-24', '2025-06-25' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'fred@trulyswahili.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- fred@trulyswahili.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-06-25', '2025-06-26' FROM lms_users u, courses c WHERE u.email = 'fred@trulyswahili.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-06-25', '2025-06-26' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'fred@trulyswahili.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- fred@trulyswahili.com -> TraAdv2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-06-23', '2025-06-23' FROM lms_users u, courses c WHERE u.email = 'fred@trulyswahili.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-06-23', '2025-06-23' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'fred@trulyswahili.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- fred@trulyswahili.com -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-10-02', '2025-10-06' FROM lms_users u, courses c WHERE u.email = 'fred@trulyswahili.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-10-02', '2025-10-06' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'fred@trulyswahili.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- g.chaibi@experiencemorocco.com -> TCL1 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-06-09', NULL FROM lms_users u, courses c WHERE u.email = 'g.chaibi@experiencemorocco.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- gabriele@authenticusitaly.it -> TraAdv2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-27', '2026-02-27' FROM lms_users u, courses c WHERE u.email = 'gabriele@authenticusitaly.it' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-27', '2026-02-27' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'gabriele@authenticusitaly.it' AND c.code = 'TraAdv2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- gabriele@authenticusitaly.it -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-03-08', '2026-03-08' FROM lms_users u, courses c WHERE u.email = 'gabriele@authenticusitaly.it' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-03-08', '2026-03-08' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'gabriele@authenticusitaly.it' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- giulia@authenticusitaly.it -> BPG02 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2026-03-11', NULL FROM lms_users u, courses c WHERE u.email = 'giulia@authenticusitaly.it' AND c.code = 'BPG02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- giulia@authenticusitaly.it -> TCL1 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-02-25', NULL FROM lms_users u, courses c WHERE u.email = 'giulia@authenticusitaly.it' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- giulia@authenticusitaly.it -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-10-13', '2025-11-05' FROM lms_users u, courses c WHERE u.email = 'giulia@authenticusitaly.it' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-10-13', '2025-11-05' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'giulia@authenticusitaly.it' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- giulia@travelcollection.co -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-05-09', '2025-05-09' FROM lms_users u, courses c WHERE u.email = 'giulia@travelcollection.co' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-05-09', '2025-05-09' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'giulia@travelcollection.co' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- giulia@travelcollection.co -> SFAC02 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-05-09', '2025-05-09' FROM lms_users u, courses c WHERE u.email = 'giulia@travelcollection.co' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-05-09', '2025-05-09' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'giulia@travelcollection.co' AND c.code = 'SFAC02' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- giulia@travelcollection.co -> SFAC03 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-04-15', '2025-05-09' FROM lms_users u, courses c WHERE u.email = 'giulia@travelcollection.co' AND c.code = 'SFAC03' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-04-15', '2025-05-09' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'giulia@travelcollection.co' AND c.code = 'SFAC03' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- giulia@travelcollection.co -> SFAC05 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-04-15', NULL FROM lms_users u, courses c WHERE u.email = 'giulia@travelcollection.co' AND c.code = 'SFAC05' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- giulia@travelcollection.co -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2024-12-05', '2024-12-05' FROM lms_users u, courses c WHERE u.email = 'giulia@travelcollection.co' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2024-12-05', '2024-12-05' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'giulia@travelcollection.co' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- giulia@travelcollection.co -> TraAdv2 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-01-21', NULL FROM lms_users u, courses c WHERE u.email = 'giulia@travelcollection.co' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- gruenzig-sugiya@oshinobitravel.com -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-12', '2025-09-12' FROM lms_users u, courses c WHERE u.email = 'gruenzig-sugiya@oshinobitravel.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-12', '2025-09-12' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'gruenzig-sugiya@oshinobitravel.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- gruenzig-sugiya@oshinobitravel.com -> SFAC02 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-12', '2025-10-03' FROM lms_users u, courses c WHERE u.email = 'gruenzig-sugiya@oshinobitravel.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-12', '2025-10-03' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'gruenzig-sugiya@oshinobitravel.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- gruenzig-sugiya@oshinobitravel.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-08', '2025-09-12' FROM lms_users u, courses c WHERE u.email = 'gruenzig-sugiya@oshinobitravel.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-08', '2025-09-12' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'gruenzig-sugiya@oshinobitravel.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- gruenzig-sugiya@oshinobitravel.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-24', '2025-10-01' FROM lms_users u, courses c WHERE u.email = 'gruenzig-sugiya@oshinobitravel.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-24', '2025-10-01' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'gruenzig-sugiya@oshinobitravel.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- gruenzig-sugiya@oshinobitravel.com -> TraAdv2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-12', '2025-10-01' FROM lms_users u, courses c WHERE u.email = 'gruenzig-sugiya@oshinobitravel.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-12', '2025-10-01' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'gruenzig-sugiya@oshinobitravel.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- gruenzig-sugiya@oshinobitravel.com -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-19', '2025-09-22' FROM lms_users u, courses c WHERE u.email = 'gruenzig-sugiya@oshinobitravel.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-19', '2025-09-22' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'gruenzig-sugiya@oshinobitravel.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- h.el-iklil@experiencemorocco.com -> BPG02 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2026-03-16', NULL FROM lms_users u, courses c WHERE u.email = 'h.el-iklil@experiencemorocco.com' AND c.code = 'BPG02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- hajar@experiencemorocco.com -> TCL2 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-10-23', NULL FROM lms_users u, courses c WHERE u.email = 'hajar@experiencemorocco.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- hazan@sarturkiye.com -> SFAC01 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-09-06', NULL FROM lms_users u, courses c WHERE u.email = 'hazan@sarturkiye.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- hazan@sarturkiye.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-03', '2025-07-05' FROM lms_users u, courses c WHERE u.email = 'hazan@sarturkiye.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-03', '2025-07-05' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'hazan@sarturkiye.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- hazan@sarturkiye.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-05', '2025-07-09' FROM lms_users u, courses c WHERE u.email = 'hazan@sarturkiye.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-05', '2025-07-09' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'hazan@sarturkiye.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- hazan@sarturkiye.com -> TraAdv3 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-10-26', NULL FROM lms_users u, courses c WHERE u.email = 'hazan@sarturkiye.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- hiroshi@oshinobitravel.com -> SFAC01 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-09-09', NULL FROM lms_users u, courses c WHERE u.email = 'hiroshi@oshinobitravel.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- hiroshi@oshinobitravel.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2024-12-06', '2024-12-12' FROM lms_users u, courses c WHERE u.email = 'hiroshi@oshinobitravel.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2024-12-06', '2024-12-12' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'hiroshi@oshinobitravel.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- hiroshi@oshinobitravel.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2024-12-19', '2024-12-21' FROM lms_users u, courses c WHERE u.email = 'hiroshi@oshinobitravel.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2024-12-19', '2024-12-21' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'hiroshi@oshinobitravel.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- hiroshi@oshinobitravel.com -> TraAdv2 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-01-21', NULL FROM lms_users u, courses c WHERE u.email = 'hiroshi@oshinobitravel.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- hiroshi@oshinobitravel.com -> TraAdv3 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-09-19', NULL FROM lms_users u, courses c WHERE u.email = 'hiroshi@oshinobitravel.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- ihab@travelcollection.co -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-06-11', '2025-06-11' FROM lms_users u, courses c WHERE u.email = 'ihab@travelcollection.co' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-06-11', '2025-06-11' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ihab@travelcollection.co' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ihab@travelcollection.co -> SFAC02 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-06-11', '2025-06-11' FROM lms_users u, courses c WHERE u.email = 'ihab@travelcollection.co' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-06-11', '2025-06-11' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ihab@travelcollection.co' AND c.code = 'SFAC02' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ihab@travelcollection.co -> SFAC03 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-06-11', NULL FROM lms_users u, courses c WHERE u.email = 'ihab@travelcollection.co' AND c.code = 'SFAC03' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- ihab@travelcollection.co -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-10', '2026-02-10' FROM lms_users u, courses c WHERE u.email = 'ihab@travelcollection.co' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-10', '2026-02-10' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ihab@travelcollection.co' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ingrid@acrossmexico.com -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-05-06', '2025-05-06' FROM lms_users u, courses c WHERE u.email = 'ingrid@acrossmexico.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-05-06', '2025-05-06' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ingrid@acrossmexico.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ingrid@acrossmexico.com -> SFAC02 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-05-09', '2025-05-09' FROM lms_users u, courses c WHERE u.email = 'ingrid@acrossmexico.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-05-09', '2025-05-09' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ingrid@acrossmexico.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ingrid@acrossmexico.com -> SFAC03 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-05-09', '2025-05-10' FROM lms_users u, courses c WHERE u.email = 'ingrid@acrossmexico.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-05-09', '2025-05-10' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ingrid@acrossmexico.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ingrid@acrossmexico.com -> SFAC04 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-30', '2025-10-31' FROM lms_users u, courses c WHERE u.email = 'ingrid@acrossmexico.com' AND c.code = 'SFAC04' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-30', '2025-10-31' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ingrid@acrossmexico.com' AND c.code = 'SFAC04' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ingrid@acrossmexico.com -> SFAC05 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-05-10', '2025-05-12' FROM lms_users u, courses c WHERE u.email = 'ingrid@acrossmexico.com' AND c.code = 'SFAC05' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-05-10', '2025-05-12' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ingrid@acrossmexico.com' AND c.code = 'SFAC05' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ingrid@acrossmexico.com -> SFAC06 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-10-31', '2025-10-31' FROM lms_users u, courses c WHERE u.email = 'ingrid@acrossmexico.com' AND c.code = 'SFAC06' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-10-31', '2025-10-31' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ingrid@acrossmexico.com' AND c.code = 'SFAC06' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ingrid@acrossmexico.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-05-05', '2025-05-05' FROM lms_users u, courses c WHERE u.email = 'ingrid@acrossmexico.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-05-05', '2025-05-05' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ingrid@acrossmexico.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ingrid@acrossmexico.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-05-05', '2025-05-06' FROM lms_users u, courses c WHERE u.email = 'ingrid@acrossmexico.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-05-05', '2025-05-06' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ingrid@acrossmexico.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ingrid@acrossmexico.com -> TraAdv2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-05-06', '2025-05-06' FROM lms_users u, courses c WHERE u.email = 'ingrid@acrossmexico.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-05-06', '2025-05-06' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ingrid@acrossmexico.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ingrid@acrossmexico.com -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-18', '2025-10-31' FROM lms_users u, courses c WHERE u.email = 'ingrid@acrossmexico.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-18', '2025-10-31' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ingrid@acrossmexico.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- innocent@travelcollection.co -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-04-02', '2025-04-02' FROM lms_users u, courses c WHERE u.email = 'innocent@travelcollection.co' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-04-02', '2025-04-02' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'innocent@travelcollection.co' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- javier@unboxspain.com -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-10-14', '2025-11-17' FROM lms_users u, courses c WHERE u.email = 'javier@unboxspain.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-10-14', '2025-11-17' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'javier@unboxspain.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- juan@unboxspain.com -> SFAC01 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-05-04', NULL FROM lms_users u, courses c WHERE u.email = 'juan@unboxspain.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- juan@unboxspain.com -> TCL1 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2024-12-09', NULL FROM lms_users u, courses c WHERE u.email = 'juan@unboxspain.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- juan@unboxspain.com -> TraAdv2 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-01-18', NULL FROM lms_users u, courses c WHERE u.email = 'juan@unboxspain.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- karen@crownjourney.com -> TCL1 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-06-05', NULL FROM lms_users u, courses c WHERE u.email = 'karen@crownjourney.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- karen@crownjourney.com -> TraAdv2 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-01-15', NULL FROM lms_users u, courses c WHERE u.email = 'karen@crownjourney.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- kavya@crownjourney.com -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-06-24', '2025-06-24' FROM lms_users u, courses c WHERE u.email = 'kavya@crownjourney.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-06-24', '2025-06-24' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'kavya@crownjourney.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- kavya@crownjourney.com -> SFAC02 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-14', '2025-07-14' FROM lms_users u, courses c WHERE u.email = 'kavya@crownjourney.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-14', '2025-07-14' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'kavya@crownjourney.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- kavya@crownjourney.com -> SFAC03 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-15', '2025-07-16' FROM lms_users u, courses c WHERE u.email = 'kavya@crownjourney.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-15', '2025-07-16' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'kavya@crownjourney.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- kavya@crownjourney.com -> SFAC04 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-16', '2025-07-16' FROM lms_users u, courses c WHERE u.email = 'kavya@crownjourney.com' AND c.code = 'SFAC04' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-16', '2025-07-16' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'kavya@crownjourney.com' AND c.code = 'SFAC04' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- kavya@crownjourney.com -> SFAC05 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-16', '2025-07-16' FROM lms_users u, courses c WHERE u.email = 'kavya@crownjourney.com' AND c.code = 'SFAC05' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-16', '2025-07-16' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'kavya@crownjourney.com' AND c.code = 'SFAC05' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- kavya@crownjourney.com -> SFAC06 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-16', '2025-07-16' FROM lms_users u, courses c WHERE u.email = 'kavya@crownjourney.com' AND c.code = 'SFAC06' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-16', '2025-07-16' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'kavya@crownjourney.com' AND c.code = 'SFAC06' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- kavya@crownjourney.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-06-09', '2025-06-10' FROM lms_users u, courses c WHERE u.email = 'kavya@crownjourney.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-06-09', '2025-06-10' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'kavya@crownjourney.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- kavya@crownjourney.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-06-11', '2025-07-15' FROM lms_users u, courses c WHERE u.email = 'kavya@crownjourney.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-06-11', '2025-07-15' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'kavya@crownjourney.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- kavya@crownjourney.com -> TraAdv2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-11-20', '2025-11-20' FROM lms_users u, courses c WHERE u.email = 'kavya@crownjourney.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-11-20', '2025-11-20' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'kavya@crownjourney.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- kavya@crownjourney.com -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-11-20', '2025-11-20' FROM lms_users u, courses c WHERE u.email = 'kavya@crownjourney.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-11-20', '2025-11-20' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'kavya@crownjourney.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- l.ait-elmahjoub@experiencemorocco.com -> TraAdv3 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-11-14', NULL FROM lms_users u, courses c WHERE u.email = 'l.ait-elmahjoub@experiencemorocco.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- lamia.elakkad@experiencemorocco.com -> TCL1 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2024-12-10', NULL FROM lms_users u, courses c WHERE u.email = 'lamia.elakkad@experiencemorocco.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- liorah@essentiallyfrench.com -> TCL2 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-02-12', NULL FROM lms_users u, courses c WHERE u.email = 'liorah@essentiallyfrench.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- liorah@essentiallyfrench.com -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-10-31', '2025-10-31' FROM lms_users u, courses c WHERE u.email = 'liorah@essentiallyfrench.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-10-31', '2025-10-31' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'liorah@essentiallyfrench.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- lucia@unboxspain.com -> TCL1 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-10-28', NULL FROM lms_users u, courses c WHERE u.email = 'lucia@unboxspain.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- lucia@unboxspain.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-10-15', '2025-10-28' FROM lms_users u, courses c WHERE u.email = 'lucia@unboxspain.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-10-15', '2025-10-28' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'lucia@unboxspain.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ludivine@essentiallyfrench.com -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-23', '2026-02-23' FROM lms_users u, courses c WHERE u.email = 'ludivine@essentiallyfrench.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-23', '2026-02-23' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ludivine@essentiallyfrench.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ludivine@essentiallyfrench.com -> SFAC02 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2026-02-23', NULL FROM lms_users u, courses c WHERE u.email = 'ludivine@essentiallyfrench.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- ludivine@essentiallyfrench.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-23', '2026-02-23' FROM lms_users u, courses c WHERE u.email = 'ludivine@essentiallyfrench.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-23', '2026-02-23' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ludivine@essentiallyfrench.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- ludivine@essentiallyfrench.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-23', '2026-02-23' FROM lms_users u, courses c WHERE u.email = 'ludivine@essentiallyfrench.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-23', '2026-02-23' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'ludivine@essentiallyfrench.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- luky@kembaliindonesia.com -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-01-30', '2026-02-02' FROM lms_users u, courses c WHERE u.email = 'luky@kembaliindonesia.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-01-30', '2026-02-02' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'luky@kembaliindonesia.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- luky@kembaliindonesia.com -> SFAC02 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2026-02-02', NULL FROM lms_users u, courses c WHERE u.email = 'luky@kembaliindonesia.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- m.akhrif@experiencemorocco.com -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-11-13', '2025-11-13' FROM lms_users u, courses c WHERE u.email = 'm.akhrif@experiencemorocco.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-11-13', '2025-11-13' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'm.akhrif@experiencemorocco.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- m.akhrif@experiencemorocco.com -> TCL2 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-11-13', NULL FROM lms_users u, courses c WHERE u.email = 'm.akhrif@experiencemorocco.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- mako@oshinobitravel.com -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-10', '2025-09-10' FROM lms_users u, courses c WHERE u.email = 'mako@oshinobitravel.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-10', '2025-09-10' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'mako@oshinobitravel.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- mako@oshinobitravel.com -> SFAC02 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-10', '2025-09-14' FROM lms_users u, courses c WHERE u.email = 'mako@oshinobitravel.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-10', '2025-09-14' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'mako@oshinobitravel.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- mako@oshinobitravel.com -> SFAC03 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-09-16', NULL FROM lms_users u, courses c WHERE u.email = 'mako@oshinobitravel.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- mako@oshinobitravel.com -> TCL1 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-09-08', NULL FROM lms_users u, courses c WHERE u.email = 'mako@oshinobitravel.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- mako@oshinobitravel.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-12', '2025-09-15' FROM lms_users u, courses c WHERE u.email = 'mako@oshinobitravel.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-12', '2025-09-15' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'mako@oshinobitravel.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- mako@oshinobitravel.com -> TraAdv2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-10', '2025-09-12' FROM lms_users u, courses c WHERE u.email = 'mako@oshinobitravel.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-10', '2025-09-12' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'mako@oshinobitravel.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- maria@authenticusitaly.it -> TCL1 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2024-12-10', NULL FROM lms_users u, courses c WHERE u.email = 'maria@authenticusitaly.it' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- martafc@unboxspain.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2024-12-10', '2025-01-03' FROM lms_users u, courses c WHERE u.email = 'martafc@unboxspain.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2024-12-10', '2025-01-03' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'martafc@unboxspain.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- martafc@unboxspain.com -> TCL2 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-12-04', NULL FROM lms_users u, courses c WHERE u.email = 'martafc@unboxspain.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- martafc@unboxspain.com -> TraAdv2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-01-22', '2025-01-22' FROM lms_users u, courses c WHERE u.email = 'martafc@unboxspain.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-01-22', '2025-01-22' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'martafc@unboxspain.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- martafc@unboxspain.com -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-10-10', '2025-10-15' FROM lms_users u, courses c WHERE u.email = 'martafc@unboxspain.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-10-10', '2025-10-15' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'martafc@unboxspain.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- maryama@experiencemorocco.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2024-12-09', '2025-08-11' FROM lms_users u, courses c WHERE u.email = 'maryama@experiencemorocco.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2024-12-09', '2025-08-11' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'maryama@experiencemorocco.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- mayuno@oshinobitravel.com -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-12', '2025-09-12' FROM lms_users u, courses c WHERE u.email = 'mayuno@oshinobitravel.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-12', '2025-09-12' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'mayuno@oshinobitravel.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- mayuno@oshinobitravel.com -> SFAC02 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-12', '2025-10-14' FROM lms_users u, courses c WHERE u.email = 'mayuno@oshinobitravel.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-12', '2025-10-14' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'mayuno@oshinobitravel.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- mayuno@oshinobitravel.com -> SFAC03 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-12-25', NULL FROM lms_users u, courses c WHERE u.email = 'mayuno@oshinobitravel.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- mayuno@oshinobitravel.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-08', '2025-09-08' FROM lms_users u, courses c WHERE u.email = 'mayuno@oshinobitravel.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-08', '2025-09-08' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'mayuno@oshinobitravel.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- mayuno@oshinobitravel.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-19', '2025-09-24' FROM lms_users u, courses c WHERE u.email = 'mayuno@oshinobitravel.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-19', '2025-09-24' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'mayuno@oshinobitravel.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- mayuno@oshinobitravel.com -> TraAdv2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-12', '2025-09-12' FROM lms_users u, courses c WHERE u.email = 'mayuno@oshinobitravel.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-12', '2025-09-12' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'mayuno@oshinobitravel.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- mayuno@oshinobitravel.com -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-19', '2025-10-14' FROM lms_users u, courses c WHERE u.email = 'mayuno@oshinobitravel.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-19', '2025-10-14' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'mayuno@oshinobitravel.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- melvin@trulyswahili.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2024-12-09', '2024-12-09' FROM lms_users u, courses c WHERE u.email = 'melvin@trulyswahili.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2024-12-09', '2024-12-09' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'melvin@trulyswahili.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- milena@travelcollection.co -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-05-02', '2025-05-06' FROM lms_users u, courses c WHERE u.email = 'milena@travelcollection.co' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-05-02', '2025-05-06' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'milena@travelcollection.co' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- mustafa@kembaliindonesia.com -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-05-13', '2025-05-13' FROM lms_users u, courses c WHERE u.email = 'mustafa@kembaliindonesia.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-05-13', '2025-05-13' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'mustafa@kembaliindonesia.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- mustafa@kembaliindonesia.com -> SFAC02 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-05-13', '2025-05-13' FROM lms_users u, courses c WHERE u.email = 'mustafa@kembaliindonesia.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-05-13', '2025-05-13' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'mustafa@kembaliindonesia.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- mustafa@kembaliindonesia.com -> SFAC03 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-05-13', NULL FROM lms_users u, courses c WHERE u.email = 'mustafa@kembaliindonesia.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- mustafa@kembaliindonesia.com -> SFAC05 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-05-13', NULL FROM lms_users u, courses c WHERE u.email = 'mustafa@kembaliindonesia.com' AND c.code = 'SFAC05' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- mustafa@kembaliindonesia.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-02-11', '2025-02-11' FROM lms_users u, courses c WHERE u.email = 'mustafa@kembaliindonesia.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-02-11', '2025-02-11' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'mustafa@kembaliindonesia.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- nick@nirathailand.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-02', '2025-07-07' FROM lms_users u, courses c WHERE u.email = 'nick@nirathailand.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-02', '2025-07-07' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'nick@nirathailand.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- nick@nirathailand.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-09', '2025-07-11' FROM lms_users u, courses c WHERE u.email = 'nick@nirathailand.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-09', '2025-07-11' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'nick@nirathailand.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- paras@travelcollection.co -> SFAC01 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2026-02-10', NULL FROM lms_users u, courses c WHERE u.email = 'paras@travelcollection.co' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- r.chandour@experiencemorocco.com -> TCL1 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-11-14', NULL FROM lms_users u, courses c WHERE u.email = 'r.chandour@experiencemorocco.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- radia@majlisretreats.com -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-05-29', '2025-05-29' FROM lms_users u, courses c WHERE u.email = 'radia@majlisretreats.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-05-29', '2025-05-29' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'radia@majlisretreats.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- radia@majlisretreats.com -> SFAC02 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-05-29', NULL FROM lms_users u, courses c WHERE u.email = 'radia@majlisretreats.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- radia@majlisretreats.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2024-12-09', '2024-12-09' FROM lms_users u, courses c WHERE u.email = 'radia@majlisretreats.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2024-12-09', '2024-12-09' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'radia@majlisretreats.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- radia@majlisretreats.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-04-30', '2025-04-30' FROM lms_users u, courses c WHERE u.email = 'radia@majlisretreats.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-04-30', '2025-04-30' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'radia@majlisretreats.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- radia@majlisretreats.com -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-18', '2025-09-18' FROM lms_users u, courses c WHERE u.email = 'radia@majlisretreats.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-18', '2025-09-18' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'radia@majlisretreats.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- s.baljid@experiencemorocco.com -> TCL2 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2026-01-09', NULL FROM lms_users u, courses c WHERE u.email = 's.baljid@experiencemorocco.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- s.laghribi@experiencemorocco.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-11-13', '2025-11-13' FROM lms_users u, courses c WHERE u.email = 's.laghribi@experiencemorocco.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-11-13', '2025-11-13' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 's.laghribi@experiencemorocco.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- salima@experiencemorocco.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-11-14', '2025-11-14' FROM lms_users u, courses c WHERE u.email = 'salima@experiencemorocco.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-11-14', '2025-11-14' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'salima@experiencemorocco.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- sami@travelcollection.co -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-04-02', '2025-04-02' FROM lms_users u, courses c WHERE u.email = 'sami@travelcollection.co' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-04-02', '2025-04-02' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'sami@travelcollection.co' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- santiago@vistacolombia.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-08', '2025-07-08' FROM lms_users u, courses c WHERE u.email = 'santiago@vistacolombia.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-08', '2025-07-08' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'santiago@vistacolombia.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- santiago@vistacolombia.com -> TraAdv2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-07-08', '2025-07-14' FROM lms_users u, courses c WHERE u.email = 'santiago@vistacolombia.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-07-08', '2025-07-14' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'santiago@vistacolombia.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- santiago@vistacolombia.com -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-01-16', '2026-01-16' FROM lms_users u, courses c WHERE u.email = 'santiago@vistacolombia.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-01-16', '2026-01-16' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'santiago@vistacolombia.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- stephan@trulyswahili.com -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-30', '2025-09-30' FROM lms_users u, courses c WHERE u.email = 'stephan@trulyswahili.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-30', '2025-09-30' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'stephan@trulyswahili.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- takae@oshinobitravel.com -> SFAC01 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-09-10', NULL FROM lms_users u, courses c WHERE u.email = 'takae@oshinobitravel.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- takae@oshinobitravel.com -> TCL1 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-09-08', NULL FROM lms_users u, courses c WHERE u.email = 'takae@oshinobitravel.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- takae@oshinobitravel.com -> TCL2 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-09-12', NULL FROM lms_users u, courses c WHERE u.email = 'takae@oshinobitravel.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- thami@travelcollection.co -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-04-02', '2025-04-02' FROM lms_users u, courses c WHERE u.email = 'thami@travelcollection.co' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-04-02', '2025-04-02' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'thami@travelcollection.co' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- thami@travelcollection.co -> TCL2 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-04-02', NULL FROM lms_users u, courses c WHERE u.email = 'thami@travelcollection.co' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- tucker@travelcollection.co -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-05-08', '2025-05-08' FROM lms_users u, courses c WHERE u.email = 'tucker@travelcollection.co' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-05-08', '2025-05-08' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'tucker@travelcollection.co' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- tucker@travelcollection.co -> SFAC02 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-05-08', '2025-05-08' FROM lms_users u, courses c WHERE u.email = 'tucker@travelcollection.co' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-05-08', '2025-05-08' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'tucker@travelcollection.co' AND c.code = 'SFAC02' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- tucker@travelcollection.co -> SFAC03 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-04-15', '2025-05-08' FROM lms_users u, courses c WHERE u.email = 'tucker@travelcollection.co' AND c.code = 'SFAC03' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-04-15', '2025-05-08' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'tucker@travelcollection.co' AND c.code = 'SFAC03' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- tucker@travelcollection.co -> SFAC04 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-06-20', '2025-06-20' FROM lms_users u, courses c WHERE u.email = 'tucker@travelcollection.co' AND c.code = 'SFAC04' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-06-20', '2025-06-20' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'tucker@travelcollection.co' AND c.code = 'SFAC04' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- tucker@travelcollection.co -> SFAC05 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-06-20', '2025-06-20' FROM lms_users u, courses c WHERE u.email = 'tucker@travelcollection.co' AND c.code = 'SFAC05' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-06-20', '2025-06-20' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'tucker@travelcollection.co' AND c.code = 'SFAC05' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- tucker@travelcollection.co -> SFAC06 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-06-20', '2025-06-20' FROM lms_users u, courses c WHERE u.email = 'tucker@travelcollection.co' AND c.code = 'SFAC06' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-06-20', '2025-06-20' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'tucker@travelcollection.co' AND c.code = 'SFAC06' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- tucker@travelcollection.co -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2024-12-05', '2024-12-05' FROM lms_users u, courses c WHERE u.email = 'tucker@travelcollection.co' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2024-12-05', '2024-12-05' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'tucker@travelcollection.co' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- tucker@travelcollection.co -> TCL2 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2024-12-18', NULL FROM lms_users u, courses c WHERE u.email = 'tucker@travelcollection.co' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- tucker@travelcollection.co -> TraAdv2 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-01-15', NULL FROM lms_users u, courses c WHERE u.email = 'tucker@travelcollection.co' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- tucker@travelcollection.co -> TraAdv3 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-09-18', NULL FROM lms_users u, courses c WHERE u.email = 'tucker@travelcollection.co' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- valerios@nostosgreece.com -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-03-02', '2026-03-02' FROM lms_users u, courses c WHERE u.email = 'valerios@nostosgreece.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-03-02', '2026-03-02' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'valerios@nostosgreece.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- valerios@nostosgreece.com -> SFAC02 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-03-02', '2026-03-02' FROM lms_users u, courses c WHERE u.email = 'valerios@nostosgreece.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-03-02', '2026-03-02' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'valerios@nostosgreece.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- valerios@nostosgreece.com -> SFAC05 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-03-03', '2026-03-09' FROM lms_users u, courses c WHERE u.email = 'valerios@nostosgreece.com' AND c.code = 'SFAC05' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-03-03', '2026-03-09' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'valerios@nostosgreece.com' AND c.code = 'SFAC05' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- valerios@nostosgreece.com -> SFAC06 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-03-09', '2026-03-09' FROM lms_users u, courses c WHERE u.email = 'valerios@nostosgreece.com' AND c.code = 'SFAC06' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-03-09', '2026-03-09' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'valerios@nostosgreece.com' AND c.code = 'SFAC06' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- valerios@nostosgreece.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-25', '2026-02-25' FROM lms_users u, courses c WHERE u.email = 'valerios@nostosgreece.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-25', '2026-02-25' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'valerios@nostosgreece.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- valerios@nostosgreece.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2026-02-25', '2026-02-27' FROM lms_users u, courses c WHERE u.email = 'valerios@nostosgreece.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2026-02-25', '2026-02-27' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'valerios@nostosgreece.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- valerios@nostosgreece.com -> TraAdv3 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2026-03-02', NULL FROM lms_users u, courses c WHERE u.email = 'valerios@nostosgreece.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- vania@acrossmexico.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-11-07', '2025-11-07' FROM lms_users u, courses c WHERE u.email = 'vania@acrossmexico.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-11-07', '2025-11-07' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'vania@acrossmexico.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- vania@acrossmexico.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-11-07', '2025-11-19' FROM lms_users u, courses c WHERE u.email = 'vania@acrossmexico.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-11-07', '2025-11-19' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'vania@acrossmexico.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- wahlquist@oshinobitravel.com -> SFAC01 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-12', '2025-09-12' FROM lms_users u, courses c WHERE u.email = 'wahlquist@oshinobitravel.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-12', '2025-09-12' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'wahlquist@oshinobitravel.com' AND c.code = 'SFAC01' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- wahlquist@oshinobitravel.com -> SFAC02 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-12', '2025-09-12' FROM lms_users u, courses c WHERE u.email = 'wahlquist@oshinobitravel.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-12', '2025-09-12' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'wahlquist@oshinobitravel.com' AND c.code = 'SFAC02' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- wahlquist@oshinobitravel.com -> SFAC03 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2025-10-06', NULL FROM lms_users u, courses c WHERE u.email = 'wahlquist@oshinobitravel.com' AND c.code = 'SFAC03' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

-- wahlquist@oshinobitravel.com -> TCL1 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-08', '2025-09-08' FROM lms_users u, courses c WHERE u.email = 'wahlquist@oshinobitravel.com' AND c.code = 'TCL1' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-08', '2025-09-08' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'wahlquist@oshinobitravel.com' AND c.code = 'TCL1' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- wahlquist@oshinobitravel.com -> TCL2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-12', '2025-09-12' FROM lms_users u, courses c WHERE u.email = 'wahlquist@oshinobitravel.com' AND c.code = 'TCL2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-12', '2025-09-12' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'wahlquist@oshinobitravel.com' AND c.code = 'TCL2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- wahlquist@oshinobitravel.com -> TraAdv2 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-24', '2025-10-01' FROM lms_users u, courses c WHERE u.email = 'wahlquist@oshinobitravel.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-24', '2025-10-01' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'wahlquist@oshinobitravel.com' AND c.code = 'TraAdv2' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- wahlquist@oshinobitravel.com -> TraAdv3 (completed)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'completed', '2025-09-19', '2025-09-19' FROM lms_users u, courses c WHERE u.email = 'wahlquist@oshinobitravel.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;
INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) SELECT u.id, l.id, 'completed', '2025-09-19', '2025-09-19' FROM lms_users u CROSS JOIN courses c JOIN modules m ON m.course_id = c.id JOIN lessons l ON l.module_id = m.id WHERE u.email = 'wahlquist@oshinobitravel.com' AND c.code = 'TraAdv3' ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = EXCLUDED.completed_at;

-- z.talmzi@experiencemorocco.com -> BPG02 (in_progress)
INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) SELECT u.id, c.id, 'in_progress', '2026-03-17', NULL FROM lms_users u, courses c WHERE u.email = 'z.talmzi@experiencemorocco.com' AND c.code = 'BPG02' ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;

COMMIT;