-- Search analytics: track what users search for and whether they find results
create table if not exists search_logs (
  id            uuid          primary key default gen_random_uuid(),
  query         text          not null,
  user_email    text,
  source        text,          -- 'wiki_search', 'global_search', 'ai_chat'
  results_count integer       default 0,
  clicked_result_id text,      -- if they clicked a result
  created_at    timestamptz   default now()
);

-- Index for analytics queries
create index if not exists idx_search_logs_created_at on search_logs (created_at desc);
create index if not exists idx_search_logs_query on search_logs (query);
