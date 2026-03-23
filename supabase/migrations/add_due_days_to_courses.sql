-- Add default due days column to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS due_days_after_enrollment integer DEFAULT NULL;

-- Comment for clarity
COMMENT ON COLUMN courses.due_days_after_enrollment IS 'Number of days after enrollment to auto-set due date. NULL means no deadline.';
