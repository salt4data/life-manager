-- ============================================================
-- Personal Life Manager — Supabase Database Schema
-- Run this in the Supabase SQL Editor (https://app.supabase.com)
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------
-- Goals table
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS goals (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  type          TEXT NOT NULL DEFAULT 'big'        CHECK (type IN ('big', 'short')),
  parent_goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  status        TEXT NOT NULL DEFAULT 'active'     CHECK (status IN ('active', 'paused', 'completed')),
  due_date      DATE,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------
-- Jobs table
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS jobs (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company          TEXT NOT NULL,
  role             TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'interested' CHECK (status IN ('interested', 'applied', 'interview', 'offer', 'rejected')),
  next_action_date DATE,
  link             TEXT,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------
-- Tasks table
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title              TEXT NOT NULL,
  status             TEXT NOT NULL DEFAULT 'todo'   CHECK (status IN ('todo', 'doing', 'done')),
  due_date           DATE,
  reminder_date_time TIMESTAMPTZ,
  priority           TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  goal_id            UUID REFERENCES goals(id) ON DELETE SET NULL,
  job_id             UUID REFERENCES jobs(id) ON DELETE SET NULL,
  notes              TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------
-- Indexes for common queries
-- -----------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_tasks_due_date   ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_status     ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_goal_id    ON tasks(goal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_job_id     ON tasks(job_id);
CREATE INDEX IF NOT EXISTS idx_goals_type       ON goals(type);
CREATE INDEX IF NOT EXISTS idx_jobs_status      ON jobs(status);

-- -----------------------------------------------------------
-- Row Level Security (RLS) — disabled for single-user mode
-- The API uses the service_role key so RLS is bypassed anyway.
-- If you later add auth, enable RLS and create policies.
-- -----------------------------------------------------------
ALTER TABLE tasks  ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals  ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs   ENABLE ROW LEVEL SECURITY;

-- Allow full access via service_role (default behavior)
CREATE POLICY "service_role_all" ON tasks  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON goals  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON jobs   FOR ALL USING (true) WITH CHECK (true);
