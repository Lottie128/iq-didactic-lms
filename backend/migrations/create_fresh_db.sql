-- Fresh database creation script for feat/enhanced-ui
-- Use this if starting from scratch

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop table if exists (careful in production!)
DROP TABLE IF EXISTS users CASCADE;

-- Create users table with all fields
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR NOT NULL UNIQUE,
    email VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    full_name VARCHAR NOT NULL,
    phone VARCHAR,
    country VARCHAR,
    occupation VARCHAR,
    profile_picture VARCHAR,
    role VARCHAR NOT NULL DEFAULT 'student',
    preferred_language VARCHAR NOT NULL DEFAULT 'en',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    profile_completion INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
);

-- Create indexes
CREATE INDEX ix_users_email ON users(email);
CREATE INDEX ix_users_student_id ON users(student_id);
