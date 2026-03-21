-- TC LMS Learn Feature Schema
-- Run this in the Supabase SQL Editor after 001_initial_schema.sql

-- ============================================================
-- 1. lms_users — LMS user profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS lms_users (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT,
  image_url     TEXT,
  brand         TEXT,
  track         TEXT CHECK (track IN ('general','travel_advisor','operations','both')),
  onboarded_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lms_users_email ON lms_users(email);
CREATE INDEX IF NOT EXISTS idx_lms_users_brand ON lms_users(brand);

-- ============================================================
-- 2. courses
-- ============================================================
CREATE TABLE IF NOT EXISTS courses (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code              TEXT NOT NULL UNIQUE,
  title             TEXT NOT NULL,
  description       TEXT,
  thumbnail_url     TEXT,
  category          TEXT NOT NULL,
  tracks            TEXT[] DEFAULT '{}',
  estimated_minutes INTEGER DEFAULT 0,
  is_published      BOOLEAN DEFAULT false,
  is_sequential     BOOLEAN DEFAULT true,
  completion_rule   TEXT NOT NULL DEFAULT 'all_lessons'
                    CHECK (completion_rule IN ('all_lessons','all_quizzes','min_score','manual')),
  min_score_pct     INTEGER,
  sort_order        INTEGER DEFAULT 0,
  created_by        TEXT,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_tracks ON courses USING gin(tracks);

-- ============================================================
-- 3. course_prerequisites
-- ============================================================
CREATE TABLE IF NOT EXISTS course_prerequisites (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id        UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  prerequisite_id  UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at       TIMESTAMPTZ DEFAULT now(),
  UNIQUE(course_id, prerequisite_id)
);
CREATE INDEX IF NOT EXISTS idx_prereqs_course ON course_prerequisites(course_id);
CREATE INDEX IF NOT EXISTS idx_prereqs_prereq ON course_prerequisites(prerequisite_id);

-- ============================================================
-- 4. modules
-- ============================================================
CREATE TABLE IF NOT EXISTS modules (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id);

-- ============================================================
-- 5. lessons
-- ============================================================
CREATE TABLE IF NOT EXISTS lessons (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id         UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  lesson_type       TEXT NOT NULL DEFAULT 'content'
                    CHECK (lesson_type IN ('content','video','quiz','wiki_link')),
  html_content      TEXT,
  wiki_node_id      UUID REFERENCES wiki_nodes(id) ON DELETE SET NULL,
  video_url         TEXT,
  estimated_minutes INTEGER DEFAULT 0,
  sort_order        INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_wiki ON lessons(wiki_node_id);

-- ============================================================
-- 6. quizzes
-- ============================================================
CREATE TABLE IF NOT EXISTS quizzes (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id         UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  passing_score     INTEGER DEFAULT 70,
  max_attempts      INTEGER DEFAULT 0,
  shuffle_questions BOOLEAN DEFAULT false,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_quizzes_lesson ON quizzes(lesson_id);

-- ============================================================
-- 7. quiz_questions
-- ============================================================
CREATE TABLE IF NOT EXISTS quiz_questions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id       UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_type TEXT NOT NULL CHECK (question_type IN (
    'single_choice','multi_choice','true_false','fill_blank','ordering'
  )),
  question_text TEXT NOT NULL,
  explanation   TEXT,
  options       JSONB NOT NULL DEFAULT '[]',
  points        INTEGER DEFAULT 1,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_questions_quiz ON quiz_questions(quiz_id);

-- ============================================================
-- 8. enrollments
-- ============================================================
CREATE TABLE IF NOT EXISTS enrollments (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES lms_users(id) ON DELETE CASCADE,
  course_id     UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at   TIMESTAMPTZ DEFAULT now(),
  due_date      DATE,
  completed_at  TIMESTAMPTZ,
  status        TEXT NOT NULL DEFAULT 'enrolled'
                CHECK (status IN ('enrolled','in_progress','completed')),
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_due ON enrollments(due_date) WHERE due_date IS NOT NULL;

-- ============================================================
-- 9. lesson_progress
-- ============================================================
CREATE TABLE IF NOT EXISTS lesson_progress (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES lms_users(id) ON DELETE CASCADE,
  lesson_id     UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status        TEXT NOT NULL DEFAULT 'not_started'
                CHECK (status IN ('not_started','in_progress','completed')),
  started_at    TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON lesson_progress(lesson_id);

-- ============================================================
-- 10. quiz_attempts
-- ============================================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES lms_users(id) ON DELETE CASCADE,
  quiz_id       UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  answers       JSONB NOT NULL DEFAULT '{}',
  score_pct     INTEGER NOT NULL,
  passed        BOOLEAN NOT NULL DEFAULT false,
  started_at    TIMESTAMPTZ DEFAULT now(),
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);

-- ============================================================
-- 11. reminder_log
-- ============================================================
CREATE TABLE IF NOT EXISTS reminder_log (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  enrollment_id   UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  reminder_type   TEXT NOT NULL,
  sent_at         TIMESTAMPTZ DEFAULT now(),
  UNIQUE(enrollment_id, reminder_type)
);

-- ============================================================
-- Row Level Security for all new tables
-- ============================================================
ALTER TABLE lms_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_prerequisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_log ENABLE ROW LEVEL SECURITY;

-- SELECT policies (open read for all)
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'lms_users','courses','course_prerequisites','modules','lessons',
    'quizzes','quiz_questions','enrollments','lesson_progress','quiz_attempts','reminder_log'
  ])
  LOOP
    EXECUTE format('CREATE POLICY %I ON %I FOR SELECT USING (true)', tbl || '_select_all', tbl);
    EXECUTE format('CREATE POLICY %I ON %I FOR INSERT TO authenticated WITH CHECK (true)', tbl || '_insert_auth', tbl);
    EXECUTE format('CREATE POLICY %I ON %I FOR UPDATE TO authenticated USING (true) WITH CHECK (true)', tbl || '_update_auth', tbl);
    EXECUTE format('CREATE POLICY %I ON %I FOR DELETE TO authenticated USING (true)', tbl || '_delete_auth', tbl);
  END LOOP;
END $$;

-- ============================================================
-- Updated_at triggers (reuse existing function)
-- ============================================================
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'lms_users','courses','modules','lessons','quizzes','quiz_questions',
    'enrollments','lesson_progress'
  ])
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', tbl || '_updated_at', tbl);
    EXECUTE format(
      'CREATE TRIGGER %I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
      tbl || '_updated_at', tbl
    );
  END LOOP;
END $$;
