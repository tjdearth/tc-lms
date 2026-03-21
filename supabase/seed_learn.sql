-- seed_learn.sql — Seed data for 11 Learn courses (Travel Collection LMS)
-- Based on MangoApps course catalog

DO $$
DECLARE
  -- Course IDs
  c_tcl1    uuid;
  c_tcl2    uuid;
  c_sfac01  uuid;
  c_sfac02  uuid;
  c_sfac03  uuid;
  c_sfac04  uuid;
  c_sfac05  uuid;
  c_sfac06  uuid;
  c_tradv2  uuid;
  c_tradv3  uuid;
  c_bpg02   uuid;
  -- Module IDs
  m_id      uuid;
  -- Lesson IDs
  l_content uuid;
  l_quiz    uuid;
  -- Quiz ID
  q_id      uuid;
BEGIN

  -- ============================================================
  -- Category: General Onboarding
  -- ============================================================

  -- TCL1 - Travel Collection Overview
  c_tcl1 := gen_random_uuid();
  INSERT INTO learn_courses (id, code, title, description, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, sort_order)
  VALUES (c_tcl1, 'TCL1', 'Travel Collection Overview', 'General onboarding for all staff.', 'General Onboarding', '{general,travel_advisor,operations,both}', 30, true, true, 'all_lessons', 1);

  m_id := gen_random_uuid();
  INSERT INTO learn_modules (id, course_id, title, sort_order) VALUES (m_id, c_tcl1, 'Main Content', 1);

  l_content := gen_random_uuid();
  INSERT INTO learn_lessons (id, module_id, title, type, html_content, sort_order)
  VALUES (l_content, m_id, 'Introduction', 'content', '<p>Course content coming soon.</p>', 1);

  l_quiz := gen_random_uuid();
  INSERT INTO learn_lessons (id, module_id, title, type, sort_order)
  VALUES (l_quiz, m_id, 'Knowledge Check', 'quiz', 2);

  q_id := gen_random_uuid();
  INSERT INTO learn_quizzes (id, lesson_id, passing_score, max_attempts) VALUES (q_id, l_quiz, 70, 3);

  INSERT INTO learn_quiz_questions (id, quiz_id, type, question_text, options, sort_order) VALUES
    (gen_random_uuid(), q_id, 'true_false', 'This is a placeholder question about Travel Collection Overview. True or False?',
     '[{"label": "True", "is_correct": true}, {"label": "False", "is_correct": false}]'::jsonb, 1),
    (gen_random_uuid(), q_id, 'single_choice', 'Which of the following best describes Travel Collection Overview?',
     '[{"label": "General onboarding for all staff", "is_correct": true}, {"label": "A Salesforce training course", "is_correct": false}, {"label": "A destination-specific guide", "is_correct": false}]'::jsonb, 2);

  -- TCL2 - DMC Brand Training
  c_tcl2 := gen_random_uuid();
  INSERT INTO learn_courses (id, code, title, description, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, sort_order)
  VALUES (c_tcl2, 'TCL2', 'DMC Brand Training', 'Understanding our 16 DMC brands.', 'General Onboarding', '{general,travel_advisor,operations,both}', 45, true, true, 'all_lessons', 2);

  m_id := gen_random_uuid();
  INSERT INTO learn_modules (id, course_id, title, sort_order) VALUES (m_id, c_tcl2, 'Main Content', 1);

  l_content := gen_random_uuid();
  INSERT INTO learn_lessons (id, module_id, title, type, html_content, sort_order)
  VALUES (l_content, m_id, 'Introduction', 'content', '<p>Course content coming soon.</p>', 1);

  l_quiz := gen_random_uuid();
  INSERT INTO learn_lessons (id, module_id, title, type, sort_order)
  VALUES (l_quiz, m_id, 'Knowledge Check', 'quiz', 2);

  q_id := gen_random_uuid();
  INSERT INTO learn_quizzes (id, lesson_id, passing_score, max_attempts) VALUES (q_id, l_quiz, 70, 3);

  INSERT INTO learn_quiz_questions (id, quiz_id, type, question_text, options, sort_order) VALUES
    (gen_random_uuid(), q_id, 'true_false', 'This is a placeholder question about DMC Brand Training. True or False?',
     '[{"label": "True", "is_correct": true}, {"label": "False", "is_correct": false}]'::jsonb, 1),
    (gen_random_uuid(), q_id, 'single_choice', 'Which of the following best describes DMC Brand Training?',
     '[{"label": "Understanding our 16 DMC brands", "is_correct": true}, {"label": "A Salesforce training course", "is_correct": false}, {"label": "A destination-specific guide", "is_correct": false}]'::jsonb, 2);

  -- ============================================================
  -- Category: Salesforce Academy
  -- ============================================================

  -- SFAC01 - Salesforce Fundamentals
  c_sfac01 := gen_random_uuid();
  INSERT INTO learn_courses (id, code, title, description, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, sort_order)
  VALUES (c_sfac01, 'SFAC01', 'Salesforce Fundamentals', 'Basic Salesforce navigation and concepts.', 'Salesforce Academy', '{travel_advisor,operations,both}', 60, true, true, 'all_lessons', 1);

  m_id := gen_random_uuid();
  INSERT INTO learn_modules (id, course_id, title, sort_order) VALUES (m_id, c_sfac01, 'Main Content', 1);

  l_content := gen_random_uuid();
  INSERT INTO learn_lessons (id, module_id, title, type, html_content, sort_order)
  VALUES (l_content, m_id, 'Introduction', 'content', '<p>Course content coming soon.</p>', 1);

  l_quiz := gen_random_uuid();
  INSERT INTO learn_lessons (id, module_id, title, type, sort_order)
  VALUES (l_quiz, m_id, 'Knowledge Check', 'quiz', 2);

  q_id := gen_random_uuid();
  INSERT INTO learn_quizzes (id, lesson_id, passing_score, max_attempts) VALUES (q_id, l_quiz, 70, 3);

  INSERT INTO learn_quiz_questions (id, quiz_id, type, question_text, options, sort_order) VALUES
    (gen_random_uuid(), q_id, 'true_false', 'This is a placeholder question about Salesforce Fundamentals. True or False?',
     '[{"label": "True", "is_correct": true}, {"label": "False", "is_correct": false}]'::jsonb, 1),
    (gen_random_uuid(), q_id, 'single_choice', 'Which of the following best describes Salesforce Fundamentals?',
     '[{"label": "Basic Salesforce navigation and concepts", "is_correct": true}, {"label": "A general onboarding course", "is_correct": false}, {"label": "A destination-specific guide", "is_correct": false}]'::jsonb, 2);

  -- SFAC02 - Salesforce Data Management
  c_sfac02 := gen_random_uuid();
  INSERT INTO learn_courses (id, code, title, description, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, sort_order)
  VALUES (c_sfac02, 'SFAC02', 'Salesforce Data Management', 'Managing records and data quality.', 'Salesforce Academy', '{travel_advisor,operations,both}', 45, true, true, 'all_lessons', 2);

  m_id := gen_random_uuid();
  INSERT INTO learn_modules (id, course_id, title, sort_order) VALUES (m_id, c_sfac02, 'Main Content', 1);

  l_content := gen_random_uuid();
  INSERT INTO learn_lessons (id, module_id, title, type, html_content, sort_order)
  VALUES (l_content, m_id, 'Introduction', 'content', '<p>Course content coming soon.</p>', 1);

  l_quiz := gen_random_uuid();
  INSERT INTO learn_lessons (id, module_id, title, type, sort_order)
  VALUES (l_quiz, m_id, 'Knowledge Check', 'quiz', 2);

  q_id := gen_random_uuid();
  INSERT INTO learn_quizzes (id, lesson_id, passing_score, max_attempts) VALUES (q_id, l_quiz, 70, 3);

  INSERT INTO learn_quiz_questions (id, quiz_id, type, question_text, options, sort_order) VALUES
    (gen_random_uuid(), q_id, 'true_false', 'This is a placeholder question about Salesforce Data Management. True or False?',
     '[{"label": "True", "is_correct": true}, {"label": "False", "is_correct": false}]'::jsonb, 1),
    (gen_random_uuid(), q_id, 'single_choice', 'Which of the following best describes Salesforce Data Management?',
     '[{"label": "Managing records and data quality", "is_correct": true}, {"label": "A general onboarding course", "is_correct": false}, {"label": "A destination-specific guide", "is_correct": false}]'::jsonb, 2);

  -- SFAC03 - Salesforce Advisor Cloud
  c_sfac03 := gen_random_uuid();
  INSERT INTO learn_courses (id, code, title, description, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, sort_order)
  VALUES (c_sfac03, 'SFAC03', 'Salesforce Advisor Cloud', 'Advisory-specific SF features.', 'Salesforce Academy', '{travel_advisor,both}', 60, true, true, 'all_lessons', 3);

  m_id := gen_random_uuid();
  INSERT INTO learn_modules (id, course_id, title, sort_order) VALUES (m_id, c_sfac03, 'Main Content', 1);

  l_content := gen_random_uuid();
  INSERT INTO learn_lessons (id, module_id, title, type, html_content, sort_order)
  VALUES (l_content, m_id, 'Introduction', 'content', '<p>Course content coming soon.</p>', 1);

  l_quiz := gen_random_uuid();
  INSERT INTO learn_lessons (id, module_id, title, type, sort_order)
  VALUES (l_quiz, m_id, 'Knowledge Check', 'quiz', 2);

  q_id := gen_random_uuid();
  INSERT INTO learn_quizzes (id, lesson_id, passing_score, max_attempts) VALUES (q_id, l_quiz, 70, 3);

  INSERT INTO learn_quiz_questions (id, quiz_id, type, question_text, options, sort_order) VALUES
    (gen_random_uuid(), q_id, 'true_false', 'This is a placeholder question about Salesforce Advisor Cloud. True or False?',
     '[{"label": "True", "is_correct": true}, {"label": "False", "is_correct": false}]'::jsonb, 1),
    (gen_random_uuid(), q_id, 'single_choice', 'Which of the following best describes Salesforce Advisor Cloud?',
     '[{"label": "Advisory-specific SF features", "is_correct": true}, {"label": "A general onboarding course", "is_correct": false}, {"label": "A destination-specific guide", "is_correct": false}]'::jsonb, 2);

  -- SFAC04 - Advanced Advisor Workflows
  c_sfac04 := gen_random_uuid();
  INSERT INTO learn_courses (id, code, title, description, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, sort_order)
  VALUES (c_sfac04, 'SFAC04', 'Advanced Advisor Workflows', 'Complex advisor automations.', 'Salesforce Academy', '{travel_advisor,both}', 45, true, true, 'all_lessons', 4);

  m_id := gen_random_uuid();
  INSERT INTO learn_modules (id, course_id, title, sort_order) VALUES (m_id, c_sfac04, 'Main Content', 1);

  l_content := gen_random_uuid();
  INSERT INTO learn_lessons (id, module_id, title, type, html_content, sort_order)
  VALUES (l_content, m_id, 'Introduction', 'content', '<p>Course content coming soon.</p>', 1);

  l_quiz := gen_random_uuid();
  INSERT INTO learn_lessons (id, module_id, title, type, sort_order)
  VALUES (l_quiz, m_id, 'Knowledge Check', 'quiz', 2);

  q_id := gen_random_uuid();
  INSERT INTO learn_quizzes (id, lesson_id, passing_score, max_attempts) VALUES (q_id, l_quiz, 70, 3);

  INSERT INTO learn_quiz_questions (id, quiz_id, type, question_text, options, sort_order) VALUES
    (gen_random_uuid(), q_id, 'true_false', 'This is a placeholder question about Advanced Advisor Workflows. True or False?',
     '[{"label": "True", "is_correct": true}, {"label": "False", "is_correct": false}]'::jsonb, 1),
    (gen_random_uuid(), q_id, 'single_choice', 'Which of the following best describes Advanced Advisor Workflows?',
     '[{"label": "Complex advisor automations", "is_correct": true}, {"label": "A general onboarding course", "is_correct": false}, {"label": "A destination-specific guide", "is_correct": false}]'::jsonb, 2);

  -- SFAC05 - Salesforce Operations Cloud
  c_sfac05 := gen_random_uuid();
  INSERT INTO learn_courses (id, code, title, description, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, sort_order)
  VALUES (c_sfac05, 'SFAC05', 'Salesforce Operations Cloud', 'Ops-specific SF features.', 'Salesforce Academy', '{operations,both}', 60, true, true, 'all_lessons', 5);

  m_id := gen_random_uuid();
  INSERT INTO learn_modules (id, course_id, title, sort_order) VALUES (m_id, c_sfac05, 'Main Content', 1);

  l_content := gen_random_uuid();
  INSERT INTO learn_lessons (id, module_id, title, type, html_content, sort_order)
  VALUES (l_content, m_id, 'Introduction', 'content', '<p>Course content coming soon.</p>', 1);

  l_quiz := gen_random_uuid();
  INSERT INTO learn_lessons (id, module_id, title, type, sort_order)
  VALUES (l_quiz, m_id, 'Knowledge Check', 'quiz', 2);

  q_id := gen_random_uuid();
  INSERT INTO learn_quizzes (id, lesson_id, passing_score, max_attempts) VALUES (q_id, l_quiz, 70, 3);

  INSERT INTO learn_quiz_questions (id, quiz_id, type, question_text, options, sort_order) VALUES
    (gen_random_uuid(), q_id, 'true_false', 'This is a placeholder question about Salesforce Operations Cloud. True or False?',
     '[{"label": "True", "is_correct": true}, {"label": "False", "is_correct": false}]'::jsonb, 1),
    (gen_random_uuid(), q_id, 'single_choice', 'Which of the following best describes Salesforce Operations Cloud?',
     '[{"label": "Ops-specific SF features", "is_correct": true}, {"label": "A general onboarding course", "is_correct": false}, {"label": "A destination-specific guide", "is_correct": false}]'::jsonb, 2);

  -- SFAC06 - Advanced Operations Workflows
  c_sfac06 := gen_random_uuid();
  INSERT INTO learn_courses (id, code, title, description, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, sort_order)
  VALUES (c_sfac06, 'SFAC06', 'Advanced Operations Workflows', 'Complex ops automations.', 'Salesforce Academy', '{operations,both}', 45, true, true, 'all_lessons', 6);

  m_id := gen_random_uuid();
  INSERT INTO learn_modules (id, course_id, title, sort_order) VALUES (m_id, c_sfac06, 'Main Content', 1);

  l_content := gen_random_uuid();
  INSERT INTO learn_lessons (id, module_id, title, type, html_content, sort_order)
  VALUES (l_content, m_id, 'Introduction', 'content', '<p>Course content coming soon.</p>', 1);

  l_quiz := gen_random_uuid();
  INSERT INTO learn_lessons (id, module_id, title, type, sort_order)
  VALUES (l_quiz, m_id, 'Knowledge Check', 'quiz', 2);

  q_id := gen_random_uuid();
  INSERT INTO learn_quizzes (id, lesson_id, passing_score, max_attempts) VALUES (q_id, l_quiz, 70, 3);

  INSERT INTO learn_quiz_questions (id, quiz_id, type, question_text, options, sort_order) VALUES
    (gen_random_uuid(), q_id, 'true_false', 'This is a placeholder question about Advanced Operations Workflows. True or False?',
     '[{"label": "True", "is_correct": true}, {"label": "False", "is_correct": false}]'::jsonb, 1),
    (gen_random_uuid(), q_id, 'single_choice', 'Which of the following best describes Advanced Operations Workflows?',
     '[{"label": "Complex ops automations", "is_correct": true}, {"label": "A general onboarding course", "is_correct": false}, {"label": "A destination-specific guide", "is_correct": false}]'::jsonb, 2);

  -- ============================================================
  -- Category: Travel Advisors
  -- ============================================================

  -- TraAdv2 - Client Consultation Skills
  c_tradv2 := gen_random_uuid();
  INSERT INTO learn_courses (id, code, title, description, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, sort_order)
  VALUES (c_tradv2, 'TraAdv2', 'Client Consultation Skills', 'How to conduct client consultations.', 'Travel Advisors', '{travel_advisor,both}', 30, true, true, 'all_lessons', 1);

  m_id := gen_random_uuid();
  INSERT INTO learn_modules (id, course_id, title, sort_order) VALUES (m_id, c_tradv2, 'Main Content', 1);

  l_content := gen_random_uuid();
  INSERT INTO learn_lessons (id, module_id, title, type, html_content, sort_order)
  VALUES (l_content, m_id, 'Introduction', 'content', '<p>Course content coming soon.</p>', 1);

  l_quiz := gen_random_uuid();
  INSERT INTO learn_lessons (id, module_id, title, type, sort_order)
  VALUES (l_quiz, m_id, 'Knowledge Check', 'quiz', 2);

  q_id := gen_random_uuid();
  INSERT INTO learn_quizzes (id, lesson_id, passing_score, max_attempts) VALUES (q_id, l_quiz, 70, 3);

  INSERT INTO learn_quiz_questions (id, quiz_id, type, question_text, options, sort_order) VALUES
    (gen_random_uuid(), q_id, 'true_false', 'This is a placeholder question about Client Consultation Skills. True or False?',
     '[{"label": "True", "is_correct": true}, {"label": "False", "is_correct": false}]'::jsonb, 1),
    (gen_random_uuid(), q_id, 'single_choice', 'Which of the following best describes Client Consultation Skills?',
     '[{"label": "How to conduct client consultations", "is_correct": true}, {"label": "A Salesforce training course", "is_correct": false}, {"label": "A general onboarding course", "is_correct": false}]'::jsonb, 2);

  -- TraAdv3 - Destination Expertise
  c_tradv3 := gen_random_uuid();
  INSERT INTO learn_courses (id, code, title, description, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, sort_order)
  VALUES (c_tradv3, 'TraAdv3', 'Destination Expertise', 'Building destination knowledge.', 'Travel Advisors', '{travel_advisor,both}', 40, true, true, 'all_lessons', 2);

  m_id := gen_random_uuid();
  INSERT INTO learn_modules (id, course_id, title, sort_order) VALUES (m_id, c_tradv3, 'Main Content', 1);

  l_content := gen_random_uuid();
  INSERT INTO learn_lessons (id, module_id, title, type, html_content, sort_order)
  VALUES (l_content, m_id, 'Introduction', 'content', '<p>Course content coming soon.</p>', 1);

  l_quiz := gen_random_uuid();
  INSERT INTO learn_lessons (id, module_id, title, type, sort_order)
  VALUES (l_quiz, m_id, 'Knowledge Check', 'quiz', 2);

  q_id := gen_random_uuid();
  INSERT INTO learn_quizzes (id, lesson_id, passing_score, max_attempts) VALUES (q_id, l_quiz, 70, 3);

  INSERT INTO learn_quiz_questions (id, quiz_id, type, question_text, options, sort_order) VALUES
    (gen_random_uuid(), q_id, 'true_false', 'This is a placeholder question about Destination Expertise. True or False?',
     '[{"label": "True", "is_correct": true}, {"label": "False", "is_correct": false}]'::jsonb, 1),
    (gen_random_uuid(), q_id, 'single_choice', 'Which of the following best describes Destination Expertise?',
     '[{"label": "Building destination knowledge", "is_correct": true}, {"label": "A Salesforce training course", "is_correct": false}, {"label": "A general onboarding course", "is_correct": false}]'::jsonb, 2);

  -- ============================================================
  -- Category: Best Practices
  -- ============================================================

  -- BPG02 - Best Practices Guide
  c_bpg02 := gen_random_uuid();
  INSERT INTO learn_courses (id, code, title, description, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, sort_order)
  VALUES (c_bpg02, 'BPG02', 'Best Practices Guide', 'Company-wide best practices.', 'Best Practices', '{general,travel_advisor,operations,both}', 20, true, true, 'all_lessons', 1);

  m_id := gen_random_uuid();
  INSERT INTO learn_modules (id, course_id, title, sort_order) VALUES (m_id, c_bpg02, 'Main Content', 1);

  l_content := gen_random_uuid();
  INSERT INTO learn_lessons (id, module_id, title, type, html_content, sort_order)
  VALUES (l_content, m_id, 'Introduction', 'content', '<p>Course content coming soon.</p>', 1);

  l_quiz := gen_random_uuid();
  INSERT INTO learn_lessons (id, module_id, title, type, sort_order)
  VALUES (l_quiz, m_id, 'Knowledge Check', 'quiz', 2);

  q_id := gen_random_uuid();
  INSERT INTO learn_quizzes (id, lesson_id, passing_score, max_attempts) VALUES (q_id, l_quiz, 70, 3);

  INSERT INTO learn_quiz_questions (id, quiz_id, type, question_text, options, sort_order) VALUES
    (gen_random_uuid(), q_id, 'true_false', 'This is a placeholder question about Best Practices Guide. True or False?',
     '[{"label": "True", "is_correct": true}, {"label": "False", "is_correct": false}]'::jsonb, 1),
    (gen_random_uuid(), q_id, 'single_choice', 'Which of the following best describes Best Practices Guide?',
     '[{"label": "Company-wide best practices", "is_correct": true}, {"label": "A Salesforce training course", "is_correct": false}, {"label": "A destination-specific guide", "is_correct": false}]'::jsonb, 2);

  -- ============================================================
  -- Prerequisites
  -- ============================================================

  -- SFAC02 requires SFAC01
  INSERT INTO learn_course_prerequisites (id, course_id, prerequisite_course_id)
  VALUES (gen_random_uuid(), c_sfac02, c_sfac01);

  -- SFAC03 requires SFAC02
  INSERT INTO learn_course_prerequisites (id, course_id, prerequisite_course_id)
  VALUES (gen_random_uuid(), c_sfac03, c_sfac02);

  -- SFAC04 requires SFAC03
  INSERT INTO learn_course_prerequisites (id, course_id, prerequisite_course_id)
  VALUES (gen_random_uuid(), c_sfac04, c_sfac03);

  -- SFAC05 requires SFAC02
  INSERT INTO learn_course_prerequisites (id, course_id, prerequisite_course_id)
  VALUES (gen_random_uuid(), c_sfac05, c_sfac02);

  -- SFAC06 requires SFAC05
  INSERT INTO learn_course_prerequisites (id, course_id, prerequisite_course_id)
  VALUES (gen_random_uuid(), c_sfac06, c_sfac05);

END $$;
