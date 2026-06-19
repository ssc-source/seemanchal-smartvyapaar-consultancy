-- migrations/add-registration-id-schema.sql
-- Phase 1: Add registration_id columns (backward compatible, NULL allowed)
-- Safe to run on production - adds columns without breaking existing data

-- 1. Add registrationId to StudentProfile (central table for bugs)
ALTER TABLE student_profiles 
ADD COLUMN IF NOT EXISTS registration_id VARCHAR(50) UNIQUE NULL;

-- 2. Add registrationId to InternshipApplication
ALTER TABLE internship_applications 
ADD COLUMN IF NOT EXISTS registration_id VARCHAR(50) UNIQUE NULL;

-- 3. Add registrationId to QuizRegistration
ALTER TABLE quiz_registrations 
ADD COLUMN IF NOT EXISTS registration_id VARCHAR(50) UNIQUE NULL;

-- 4. Add registrationId to Certificate
ALTER TABLE certificates 
ADD COLUMN IF NOT EXISTS registration_id VARCHAR(50) UNIQUE NULL;

-- 5. Create registration_counter table (starts at 360, increments per new user)
CREATE TABLE IF NOT EXISTS registration_counter (
    id INT PRIMARY KEY,
    current_count INT DEFAULT 360,
    year INT DEFAULT 2026
);

-- Insert initial counter row (only if not exists)
INSERT IGNORE INTO registration_counter (id, current_count, year) VALUES (1, 360, 2026);

-- 6. Add mustChangePassword column to User table (for existing users with temp password)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT FALSE;

-- 7. Add index for faster registration_id lookups (optional but recommended)
ALTER TABLE student_profiles ADD INDEX idx_registration_id (registration_id);
ALTER TABLE internship_applications ADD INDEX idx_registration_id (registration_id);
ALTER TABLE quiz_registrations ADD INDEX idx_registration_id (registration_id);
ALTER TABLE certificates ADD INDEX idx_registration_id (registration_id);
