-- seed_learn.sql — Seed data for 11 Learn courses (Travel Collection LMS)
-- Run AFTER 002_learn_schema.sql

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
  INSERT INTO courses (id, code, title, description, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, sort_order)
  VALUES (c_tcl1, 'TCL1', 'Travel Collection Overview', 'General onboarding for all staff.', 'General Onboarding', '{general,travel_advisor,operations,both}', 30, true, true, 'all_lessons', 1);

  m_id := gen_random_uuid();
  INSERT INTO modules (id, course_id, title, sort_order) VALUES (m_id, c_tcl1, 'Main Content', 1);

  l_content := gen_random_uuid();
  INSERT INTO lessons (id, module_id, title, lesson_type, html_content, sort_order)
  VALUES (l_content, m_id, 'Introduction', 'content', '<p>Course content coming soon.</p>', 1);

  l_quiz := gen_random_uuid();
  INSERT INTO lessons (id, module_id, title, lesson_type, sort_order)
  VALUES (l_quiz, m_id, 'Knowledge Check', 'quiz', 2);

  q_id := gen_random_uuid();
  INSERT INTO quizzes (id, lesson_id, title, passing_score, max_attempts) VALUES (q_id, l_quiz, 'Knowledge Check', 70, 3);

  INSERT INTO quiz_questions (id, quiz_id, question_type, question_text, options, sort_order) VALUES
    (gen_random_uuid(), q_id, 'true_false', 'Travel Collection operates 16 DMC brands worldwide. True or False?',
     '[{"id": "true", "text": "True", "is_correct": true}, {"id": "false", "text": "False", "is_correct": false}]'::jsonb, 1),
    (gen_random_uuid(), q_id, 'single_choice', 'What does Travel Collection primarily provide?',
     '[{"id": "a", "text": "DMC services across multiple destinations", "is_correct": true}, {"id": "b", "text": "Airline booking services", "is_correct": false}, {"id": "c", "text": "Hotel chain management", "is_correct": false}]'::jsonb, 2);

  -- TCL2 - DMC Brand Training
  c_tcl2 := gen_random_uuid();
  INSERT INTO courses (id, code, title, description, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, sort_order)
  VALUES (c_tcl2, 'TCL2', 'DMC Brand Training', 'Understanding our 16 DMC brands.', 'General Onboarding', '{general,travel_advisor,operations,both}', 45, true, true, 'all_lessons', 2);

  m_id := gen_random_uuid();
  INSERT INTO modules (id, course_id, title, sort_order) VALUES (m_id, c_tcl2, 'Main Content', 1);

  l_content := gen_random_uuid();
  INSERT INTO lessons (id, module_id, title, lesson_type, html_content, sort_order)
  VALUES (l_content, m_id, 'Introduction', 'content', '<p>Course content coming soon.</p>', 1);

  l_quiz := gen_random_uuid();
  INSERT INTO lessons (id, module_id, title, lesson_type, sort_order)
  VALUES (l_quiz, m_id, 'Knowledge Check', 'quiz', 2);

  q_id := gen_random_uuid();
  INSERT INTO quizzes (id, lesson_id, title, passing_score, max_attempts) VALUES (q_id, l_quiz, 'Knowledge Check', 70, 3);

  INSERT INTO quiz_questions (id, quiz_id, question_type, question_text, options, sort_order) VALUES
    (gen_random_uuid(), q_id, 'true_false', 'Each DMC brand operates independently in its destination country. True or False?',
     '[{"id": "true", "text": "True", "is_correct": true}, {"id": "false", "text": "False", "is_correct": false}]'::jsonb, 1),
    (gen_random_uuid(), q_id, 'single_choice', 'Which DMC brand covers Italy?',
     '[{"id": "a", "text": "Authenticus Italy", "is_correct": true}, {"id": "b", "text": "Crown Journey", "is_correct": false}, {"id": "c", "text": "Nostos Greece", "is_correct": false}]'::jsonb, 2);

  -- ============================================================
  -- Category: Salesforce Academy
  -- ============================================================

  -- SFAC01 - Salesforce Fundamentals
  c_sfac01 := gen_random_uuid();
  INSERT INTO courses (id, code, title, description, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, sort_order)
  VALUES (c_sfac01, 'SFAC01', 'Salesforce Fundamentals', 'Basic Salesforce navigation and concepts.', 'Salesforce Academy', '{travel_advisor,operations,both}', 60, true, true, 'all_lessons', 1);

  m_id := gen_random_uuid();
  INSERT INTO modules (id, course_id, title, sort_order) VALUES (m_id, c_sfac01, 'Main Content', 1);

  l_content := gen_random_uuid();
  INSERT INTO lessons (id, module_id, title, lesson_type, html_content, sort_order)
  VALUES (l_content, m_id, 'Introduction', 'content', '<p>Course content coming soon.</p>', 1);

  l_quiz := gen_random_uuid();
  INSERT INTO lessons (id, module_id, title, lesson_type, sort_order)
  VALUES (l_quiz, m_id, 'Knowledge Check', 'quiz', 2);

  q_id := gen_random_uuid();
  INSERT INTO quizzes (id, lesson_id, title, passing_score, max_attempts) VALUES (q_id, l_quiz, 'Knowledge Check', 70, 3);

  INSERT INTO quiz_questions (id, quiz_id, question_type, question_text, options, sort_order) VALUES
    (gen_random_uuid(), q_id, 'true_false', 'Salesforce is a cloud-based CRM platform. True or False?',
     '[{"id": "true", "text": "True", "is_correct": true}, {"id": "false", "text": "False", "is_correct": false}]'::jsonb, 1),
    (gen_random_uuid(), q_id, 'single_choice', 'What is the primary purpose of Salesforce at Travel Collection?',
     '[{"id": "a", "text": "Managing client relationships and bookings", "is_correct": true}, {"id": "b", "text": "Social media management", "is_correct": false}, {"id": "c", "text": "Accounting and invoicing", "is_correct": false}]'::jsonb, 2);

  -- SFAC02 - Salesforce Data Management
  c_sfac02 := gen_random_uuid();
  INSERT INTO courses (id, code, title, description, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, sort_order)
  VALUES (c_sfac02, 'SFAC02', 'Salesforce Data Management', 'Managing records and data quality.', 'Salesforce Academy', '{travel_advisor,operations,both}', 45, true, true, 'all_lessons', 2);

  m_id := gen_random_uuid();
  INSERT INTO modules (id, course_id, title, sort_order) VALUES (m_id, c_sfac02, 'Main Content', 1);

  l_content := gen_random_uuid();
  INSERT INTO lessons (id, module_id, title, lesson_type, html_content, sort_order)
  VALUES (l_content, m_id, 'Introduction', 'content', '<p>Course content coming soon.</p>', 1);

  l_quiz := gen_random_uuid();
  INSERT INTO lessons (id, module_id, title, lesson_type, sort_order)
  VALUES (l_quiz, m_id, 'Knowledge Check', 'quiz', 2);

  q_id := gen_random_uuid();
  INSERT INTO quizzes (id, lesson_id, title, passing_score, max_attempts) VALUES (q_id, l_quiz, 'Knowledge Check', 70, 3);

  INSERT INTO quiz_questions (id, quiz_id, question_type, question_text, options, sort_order) VALUES
    (gen_random_uuid(), q_id, 'true_false', 'Data quality is important for accurate reporting. True or False?',
     '[{"id": "true", "text": "True", "is_correct": true}, {"id": "false", "text": "False", "is_correct": false}]'::jsonb, 1),
    (gen_random_uuid(), q_id, 'single_choice', 'What is the best practice for duplicate records?',
     '[{"id": "a", "text": "Merge them to maintain data quality", "is_correct": true}, {"id": "b", "text": "Delete both records", "is_correct": false}, {"id": "c", "text": "Ignore them", "is_correct": false}]'::jsonb, 2);

  -- SFAC03 - Salesforce Advisor Cloud
  c_sfac03 := gen_random_uuid();
  INSERT INTO courses (id, code, title, description, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, sort_order)
  VALUES (c_sfac03, 'SFAC03', 'Salesforce Advisor Cloud', 'Advisory-specific SF features.', 'Salesforce Academy', '{travel_advisor,both}', 60, true, true, 'all_lessons', 3);

  m_id := gen_random_uuid();
  INSERT INTO modules (id, course_id, title, sort_order) VALUES (m_id, c_sfac03, 'Main Content', 1);

  l_content := gen_random_uuid();
  INSERT INTO lessons (id, module_id, title, lesson_type, html_content, sort_order)
  VALUES (l_content, m_id, 'Introduction', 'content', '<p>Course content coming soon.</p>', 1);

  l_quiz := gen_random_uuid();
  INSERT INTO lessons (id, module_id, title, lesson_type, sort_order)
  VALUES (l_quiz, m_id, 'Knowledge Check', 'quiz', 2);

  q_id := gen_random_uuid();
  INSERT INTO quizzes (id, lesson_id, title, passing_score, max_attempts) VALUES (q_id, l_quiz, 'Knowledge Check', 70, 3);

  INSERT INTO quiz_questions (id, quiz_id, question_type, question_text, options, sort_order) VALUES
    (gen_random_uuid(), q_id, 'true_false', 'Advisor Cloud is designed for client-facing travel advisors. True or False?',
     '[{"id": "true", "text": "True", "is_correct": true}, {"id": "false", "text": "False", "is_correct": false}]'::jsonb, 1),
    (gen_random_uuid(), q_id, 'single_choice', 'Which role primarily uses Advisor Cloud?',
     '[{"id": "a", "text": "Travel Advisors", "is_correct": true}, {"id": "b", "text": "Operations staff", "is_correct": false}, {"id": "c", "text": "IT administrators", "is_correct": false}]'::jsonb, 2);

  -- SFAC04 - Advanced Advisor Workflows
  c_sfac04 := gen_random_uuid();
  INSERT INTO courses (id, code, title, description, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, sort_order)
  VALUES (c_sfac04, 'SFAC04', 'Advanced Advisor Workflows', 'Complex advisor automations.', 'Salesforce Academy', '{travel_advisor,both}', 45, true, true, 'all_lessons', 4);

  m_id := gen_random_uuid();
  INSERT INTO modules (id, course_id, title, sort_order) VALUES (m_id, c_sfac04, 'Main Content', 1);

  l_content := gen_random_uuid();
  INSERT INTO lessons (id, module_id, title, lesson_type, html_content, sort_order)
  VALUES (l_content, m_id, 'Introduction', 'content', '<p>Course content coming soon.</p>', 1);

  l_quiz := gen_random_uuid();
  INSERT INTO lessons (id, module_id, title, lesson_type, sort_order)
  VALUES (l_quiz, m_id, 'Knowledge Check', 'quiz', 2);

  q_id := gen_random_uuid();
  INSERT INTO quizzes (id, lesson_id, title, passing_score, max_attempts) VALUES (q_id, l_quiz, 'Knowledge Check', 70, 3);

  INSERT INTO quiz_questions (id, quiz_id, question_type, question_text, options, sort_order) VALUES
    (gen_random_uuid(), q_id, 'true_false', 'Workflow automations can send email alerts automatically. True or False?',
     '[{"id": "true", "text": "True", "is_correct": true}, {"id": "false", "text": "False", "is_correct": false}]'::jsonb, 1),
    (gen_random_uuid(), q_id, 'single_choice', 'What is a key benefit of automated advisor workflows?',
     '[{"id": "a", "text": "Reduced manual data entry and faster response times", "is_correct": true}, {"id": "b", "text": "Replacing advisors entirely", "is_correct": false}, {"id": "c", "text": "Eliminating client communication", "is_correct": false}]'::jsonb, 2);

  -- SFAC05 - Salesforce Operations Cloud
  c_sfac05 := gen_random_uuid();
  INSERT INTO courses (id, code, title, description, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, sort_order)
  VALUES (c_sfac05, 'SFAC05', 'Salesforce Operations Cloud', 'Ops-specific SF features.', 'Salesforce Academy', '{operations,both}', 60, true, true, 'all_lessons', 5);

  m_id := gen_random_uuid();
  INSERT INTO modules (id, course_id, title, sort_order) VALUES (m_id, c_sfac05, 'Main Content', 1);

  l_content := gen_random_uuid();
  INSERT INTO lessons (id, module_id, title, lesson_type, html_content, sort_order)
  VALUES (l_content, m_id, 'Introduction', 'content', '<p>Course content coming soon.</p>', 1);

  l_quiz := gen_random_uuid();
  INSERT INTO lessons (id, module_id, title, lesson_type, sort_order)
  VALUES (l_quiz, m_id, 'Knowledge Check', 'quiz', 2);

  q_id := gen_random_uuid();
  INSERT INTO quizzes (id, lesson_id, title, passing_score, max_attempts) VALUES (q_id, l_quiz, 'Knowledge Check', 70, 3);

  INSERT INTO quiz_questions (id, quiz_id, question_type, question_text, options, sort_order) VALUES
    (gen_random_uuid(), q_id, 'true_false', 'Operations Cloud handles back-office processes. True or False?',
     '[{"id": "true", "text": "True", "is_correct": true}, {"id": "false", "text": "False", "is_correct": false}]'::jsonb, 1),
    (gen_random_uuid(), q_id, 'single_choice', 'Which team primarily uses Operations Cloud?',
     '[{"id": "a", "text": "Operations and back-office staff", "is_correct": true}, {"id": "b", "text": "Travel Advisors", "is_correct": false}, {"id": "c", "text": "Marketing team", "is_correct": false}]'::jsonb, 2);

  -- SFAC06 - Advanced Operations Workflows
  c_sfac06 := gen_random_uuid();
  INSERT INTO courses (id, code, title, description, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, sort_order)
  VALUES (c_sfac06, 'SFAC06', 'Advanced Operations Workflows', 'Complex ops automations.', 'Salesforce Academy', '{operations,both}', 45, true, true, 'all_lessons', 6);

  m_id := gen_random_uuid();
  INSERT INTO modules (id, course_id, title, sort_order) VALUES (m_id, c_sfac06, 'Main Content', 1);

  l_content := gen_random_uuid();
  INSERT INTO lessons (id, module_id, title, lesson_type, html_content, sort_order)
  VALUES (l_content, m_id, 'Introduction', 'content', '<p>Course content coming soon.</p>', 1);

  l_quiz := gen_random_uuid();
  INSERT INTO lessons (id, module_id, title, lesson_type, sort_order)
  VALUES (l_quiz, m_id, 'Knowledge Check', 'quiz', 2);

  q_id := gen_random_uuid();
  INSERT INTO quizzes (id, lesson_id, title, passing_score, max_attempts) VALUES (q_id, l_quiz, 'Knowledge Check', 70, 3);

  INSERT INTO quiz_questions (id, quiz_id, question_type, question_text, options, sort_order) VALUES
    (gen_random_uuid(), q_id, 'true_false', 'Advanced workflows can automate supplier communication. True or False?',
     '[{"id": "true", "text": "True", "is_correct": true}, {"id": "false", "text": "False", "is_correct": false}]'::jsonb, 1),
    (gen_random_uuid(), q_id, 'single_choice', 'What is a key feature of advanced operations workflows?',
     '[{"id": "a", "text": "Automated task routing and escalation", "is_correct": true}, {"id": "b", "text": "Client-facing trip proposals", "is_correct": false}, {"id": "c", "text": "Social media scheduling", "is_correct": false}]'::jsonb, 2);

  -- ============================================================
  -- Category: Travel Advisors
  -- ============================================================

  -- TraAdv2 - Client Consultation Skills
  c_tradv2 := gen_random_uuid();
  INSERT INTO courses (id, code, title, description, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, sort_order)
  VALUES (c_tradv2, 'TraAdv2', 'Client Consultation Skills', 'How to conduct client consultations.', 'Travel Advisors', '{travel_advisor,both}', 30, true, true, 'all_lessons', 1);

  m_id := gen_random_uuid();
  INSERT INTO modules (id, course_id, title, sort_order) VALUES (m_id, c_tradv2, 'Main Content', 1);

  l_content := gen_random_uuid();
  INSERT INTO lessons (id, module_id, title, lesson_type, html_content, sort_order)
  VALUES (l_content, m_id, 'Introduction', 'content', '<p>Course content coming soon.</p>', 1);

  l_quiz := gen_random_uuid();
  INSERT INTO lessons (id, module_id, title, lesson_type, sort_order)
  VALUES (l_quiz, m_id, 'Knowledge Check', 'quiz', 2);

  q_id := gen_random_uuid();
  INSERT INTO quizzes (id, lesson_id, title, passing_score, max_attempts) VALUES (q_id, l_quiz, 'Knowledge Check', 70, 3);

  INSERT INTO quiz_questions (id, quiz_id, question_type, question_text, options, sort_order) VALUES
    (gen_random_uuid(), q_id, 'true_false', 'Active listening is essential during client consultations. True or False?',
     '[{"id": "true", "text": "True", "is_correct": true}, {"id": "false", "text": "False", "is_correct": false}]'::jsonb, 1),
    (gen_random_uuid(), q_id, 'single_choice', 'What should you do first in a client consultation?',
     '[{"id": "a", "text": "Understand the client needs and preferences", "is_correct": true}, {"id": "b", "text": "Present pricing immediately", "is_correct": false}, {"id": "c", "text": "Send a contract", "is_correct": false}]'::jsonb, 2);

  -- TraAdv3 - Destination Expertise
  c_tradv3 := gen_random_uuid();
  INSERT INTO courses (id, code, title, description, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, sort_order)
  VALUES (c_tradv3, 'TraAdv3', 'Destination Expertise', 'Building destination knowledge.', 'Travel Advisors', '{travel_advisor,both}', 40, true, true, 'all_lessons', 2);

  m_id := gen_random_uuid();
  INSERT INTO modules (id, course_id, title, sort_order) VALUES (m_id, c_tradv3, 'Main Content', 1);

  l_content := gen_random_uuid();
  INSERT INTO lessons (id, module_id, title, lesson_type, html_content, sort_order)
  VALUES (l_content, m_id, 'Introduction', 'content', '<p>Course content coming soon.</p>', 1);

  l_quiz := gen_random_uuid();
  INSERT INTO lessons (id, module_id, title, lesson_type, sort_order)
  VALUES (l_quiz, m_id, 'Knowledge Check', 'quiz', 2);

  q_id := gen_random_uuid();
  INSERT INTO quizzes (id, lesson_id, title, passing_score, max_attempts) VALUES (q_id, l_quiz, 'Knowledge Check', 70, 3);

  INSERT INTO quiz_questions (id, quiz_id, question_type, question_text, options, sort_order) VALUES
    (gen_random_uuid(), q_id, 'true_false', 'Destination expertise helps advisors create better itineraries. True or False?',
     '[{"id": "true", "text": "True", "is_correct": true}, {"id": "false", "text": "False", "is_correct": false}]'::jsonb, 1),
    (gen_random_uuid(), q_id, 'single_choice', 'How should advisors build destination knowledge?',
     '[{"id": "a", "text": "Through DMC partner resources and FAM trips", "is_correct": true}, {"id": "b", "text": "Only through online reviews", "is_correct": false}, {"id": "c", "text": "By guessing based on location", "is_correct": false}]'::jsonb, 2);

  -- ============================================================
  -- Category: Best Practices
  -- ============================================================

  -- BPG02 - Best Practices Guide
  c_bpg02 := gen_random_uuid();
  INSERT INTO courses (id, code, title, description, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, sort_order)
  VALUES (c_bpg02, 'BPG02', 'Best Practices Guide', 'Company-wide best practices.', 'Best Practices', '{general,travel_advisor,operations,both}', 20, true, true, 'all_lessons', 1);

  m_id := gen_random_uuid();
  INSERT INTO modules (id, course_id, title, sort_order) VALUES (m_id, c_bpg02, 'Main Content', 1);

  l_content := gen_random_uuid();
  INSERT INTO lessons (id, module_id, title, lesson_type, html_content, sort_order)
  VALUES (l_content, m_id, 'Introduction', 'content', '<p>Course content coming soon.</p>', 1);

  l_quiz := gen_random_uuid();
  INSERT INTO lessons (id, module_id, title, lesson_type, sort_order)
  VALUES (l_quiz, m_id, 'Knowledge Check', 'quiz', 2);

  q_id := gen_random_uuid();
  INSERT INTO quizzes (id, lesson_id, title, passing_score, max_attempts) VALUES (q_id, l_quiz, 'Knowledge Check', 70, 3);

  INSERT INTO quiz_questions (id, quiz_id, question_type, question_text, options, sort_order) VALUES
    (gen_random_uuid(), q_id, 'true_false', 'Following best practices improves consistency across all DMC brands. True or False?',
     '[{"id": "true", "text": "True", "is_correct": true}, {"id": "false", "text": "False", "is_correct": false}]'::jsonb, 1),
    (gen_random_uuid(), q_id, 'single_choice', 'Why are company-wide best practices important?',
     '[{"id": "a", "text": "They ensure quality and consistency across all brands", "is_correct": true}, {"id": "b", "text": "They slow down operations", "is_correct": false}, {"id": "c", "text": "They only apply to new employees", "is_correct": false}]'::jsonb, 2);

  -- ============================================================
  -- Prerequisites
  -- ============================================================

  -- SFAC02 requires SFAC01
  INSERT INTO course_prerequisites (id, course_id, prerequisite_id)
  VALUES (gen_random_uuid(), c_sfac02, c_sfac01);

  -- SFAC03 requires SFAC02
  INSERT INTO course_prerequisites (id, course_id, prerequisite_id)
  VALUES (gen_random_uuid(), c_sfac03, c_sfac02);

  -- SFAC04 requires SFAC03
  INSERT INTO course_prerequisites (id, course_id, prerequisite_id)
  VALUES (gen_random_uuid(), c_sfac04, c_sfac03);

  -- SFAC05 requires SFAC02
  INSERT INTO course_prerequisites (id, course_id, prerequisite_id)
  VALUES (gen_random_uuid(), c_sfac05, c_sfac02);

  -- SFAC06 requires SFAC05
  INSERT INTO course_prerequisites (id, course_id, prerequisite_id)
  VALUES (gen_random_uuid(), c_sfac06, c_sfac05);

END $$;
