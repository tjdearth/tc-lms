-- Add transcript column to lessons for AI search (not displayed to learners)
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS transcript TEXT;
