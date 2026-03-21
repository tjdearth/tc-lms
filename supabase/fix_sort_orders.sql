-- Fix sort_order values that exceed Postgres integer range
-- Old formula: parts[0]*10B + parts[1]*100M + parts[2]*1M + parts[3]*10K + parts[4]*100 + parts[5]
-- New formula: parts[0]*100M + parts[1]*1M + parts[2]*10K + parts[3]*100 + parts[4]
--
-- Run this in Supabase SQL Editor to migrate existing nodes created via admin import.
-- This recalculates sort_order for any node whose title starts with a numbering pattern.

UPDATE wiki_nodes
SET sort_order = (
  SELECT
    COALESCE(parts[1]::int, 0) * 100000000 +
    COALESCE(parts[2]::int, 0) * 1000000 +
    COALESCE(parts[3]::int, 0) * 10000 +
    COALESCE(parts[4]::int, 0) * 100 +
    COALESCE(parts[5]::int, 0)
  FROM regexp_matches(title, '^(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:\.(\d+))?(?:\.(\d+))?\s') AS parts
)
WHERE title ~ '^\d+(\.\d+)*\s';
