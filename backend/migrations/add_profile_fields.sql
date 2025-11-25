-- Migration to add new profile fields to users table

ALTER TABLE users
ADD COLUMN IF NOT EXISTS student_id VARCHAR UNIQUE,
ADD COLUMN IF NOT EXISTS phone VARCHAR,
ADD COLUMN IF NOT EXISTS country VARCHAR,
ADD COLUMN IF NOT EXISTS occupation VARCHAR,
ADD COLUMN IF NOT EXISTS profile_picture VARCHAR,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS profile_completion INTEGER DEFAULT 0;

-- Generate student IDs for existing users
UPDATE users
SET student_id = 'IQD-' || EXTRACT(YEAR FROM CURRENT_DATE) || '-' || LPAD(FLOOR(RANDOM() * 90000 + 10000)::TEXT, 5, '0')
WHERE student_id IS NULL;

-- Make student_id NOT NULL after populating
ALTER TABLE users
ALTER COLUMN student_id SET NOT NULL;

-- Calculate initial profile completion for existing users
UPDATE users
SET profile_completion = (
  CASE WHEN full_name IS NOT NULL THEN 1 ELSE 0 END +
  CASE WHEN email IS NOT NULL THEN 1 ELSE 0 END +
  CASE WHEN phone IS NOT NULL THEN 1 ELSE 0 END +
  CASE WHEN country IS NOT NULL THEN 1 ELSE 0 END +
  CASE WHEN occupation IS NOT NULL THEN 1 ELSE 0 END +
  CASE WHEN profile_picture IS NOT NULL THEN 1 ELSE 0 END
) * 100 / 6;
