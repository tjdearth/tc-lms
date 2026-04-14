-- Micro-learning view tracking: log each time a user opens a micro-lesson
create table if not exists micro_lesson_views (
  id              uuid          primary key default gen_random_uuid(),
  micro_lesson_id uuid          not null references micro_lessons(id) on delete cascade,
  user_email      text,
  user_brand      text,
  created_at      timestamptz   default now()
);

-- Indexes for analytics queries
create index if not exists idx_micro_lesson_views_lesson  on micro_lesson_views (micro_lesson_id);
create index if not exists idx_micro_lesson_views_created on micro_lesson_views (created_at desc);
create index if not exists idx_micro_lesson_views_user    on micro_lesson_views (user_email);
