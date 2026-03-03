-- Knowledge Graph Studio - Initial Schema
-- Migration: 0001_initial_schema
-- Date: 2026-03-02

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- CATEGORIES TABLE (Controlled Vocabulary)
-- ============================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES categories(id),
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);

-- Seed categories (controlled - AI cannot create new ones)
INSERT INTO categories (name, slug, description, is_active) VALUES
  ('OpenClaw', 'openclaw', 'OpenClaw framework, skills, memory, tooling', true),
  ('Development', 'development', 'Development tools, libraries, frameworks', true),
  ('AI/ML', 'ai-ml', 'AI models, ML tools, LLM resources', true),
  ('Documentation', 'documentation', 'Guides, tutorials, reference docs', true),
  ('Infrastructure', 'infrastructure', 'DevOps, hosting, deployment', true),
  ('Design', 'design', 'UI/UX, design systems, tools', true),
  ('Productivity', 'productivity', 'Tools for personal/work efficiency', true),
  ('Learning', 'learning', 'Courses, books, educational content', true);

-- ============================================
-- TAGS TABLE
-- ============================================

CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tags_slug ON tags(slug);

-- ============================================
-- RESOURCES TABLE (Main Entity)
-- ============================================

CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  canonical_url TEXT NOT NULL,
  url_hash TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN (
    'documentation',
    'repository',
    'article',
    'video',
    'tool',
    'skill',
    'memory',
    'guide',
    'other'
  )),
  category_id UUID REFERENCES categories(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',
    'processing',
    'review',
    'approved',
    'rejected',
    'archived'
  )),
  needs_review BOOLEAN NOT NULL DEFAULT false,
  source TEXT NOT NULL CHECK (source IN ('notion_csv', 'json_import', 'manual')),
  raw_data JSONB,
  ai_summary TEXT,
  ai_topics TEXT[],
  ai_confidence NUMERIC(3,2),
  ai_model_used TEXT,
  manual_edits JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by_ai_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ
);

-- Deduplication index (unique)
CREATE UNIQUE INDEX idx_resources_url_hash ON resources(url_hash);
CREATE INDEX idx_resources_canonical_url ON resources(canonical_url);
CREATE INDEX idx_resources_category ON resources(category_id);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_needs_review ON resources(needs_review) WHERE needs_review = true;
CREATE INDEX idx_resources_type ON resources(resource_type);
CREATE INDEX idx_resources_source ON resources(source);
CREATE INDEX idx_resources_ai_topics ON resources USING GIN(ai_topics);

-- Full-text search index
CREATE INDEX idx_resources_search ON resources USING GIN(
  to_tsvector('english', 
    COALESCE(title, '') || ' ' || 
    COALESCE(description, '') || ' ' || 
    COALESCE(ai_summary, '')
  )
);

-- ============================================
-- RESOURCE_TAGS JUNCTION TABLE
-- ============================================

CREATE TABLE resource_tags (
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  source TEXT NOT NULL CHECK (source IN ('ai', 'manual')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (resource_id, tag_id)
);

CREATE INDEX idx_resource_tags_resource ON resource_tags(resource_id);
CREATE INDEX idx_resource_tags_tag ON resource_tags(tag_id);

-- ============================================
-- INGESTION_JOBS TABLE
-- ============================================

CREATE TABLE ingestion_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT NOT NULL CHECK (source_type IN ('notion_csv', 'json_import')),
  file_name TEXT,
  total_count INTEGER NOT NULL DEFAULT 0,
  processed_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',
    'processing',
    'completed',
    'failed',
    'cancelled'
  )),
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ingestion_jobs_status ON ingestion_jobs(status);
CREATE INDEX idx_ingestion_jobs_created ON ingestion_jobs(created_at);

-- ============================================
-- AI_LOGS TABLE (Cost Tracking + Observability)
-- ============================================

CREATE TABLE ai_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id),
  job_type TEXT NOT NULL CHECK (job_type IN (
    'categorization',
    'summarization',
    'topic_extraction',
    'relationship_inference'
  )),
  model_used TEXT NOT NULL,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  total_tokens INTEGER,
  cost_usd NUMERIC(10,6),
  latency_ms INTEGER,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  raw_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_logs_resource ON ai_logs(resource_id);
CREATE INDEX idx_ai_logs_job_type ON ai_logs(job_type);
CREATE INDEX idx_ai_logs_model ON ai_logs(model_used);
CREATE INDEX idx_ai_logs_created ON ai_logs(created_at);
CREATE INDEX idx_ai_logs_success ON ai_logs(success) WHERE success = false;

-- Cost tracking view
CREATE VIEW ai_cost_summary AS
SELECT 
  DATE(created_at) AS date,
  model_used,
  job_type,
  COUNT(*) AS request_count,
  SUM(total_tokens) AS total_tokens,
  SUM(cost_usd) AS total_cost
FROM ai_logs
WHERE success = true
GROUP BY DATE(created_at), model_used, job_type
ORDER BY date DESC;

-- ============================================
-- AUTO-UPDATE TRIGGER (updated_at)
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingestion_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;

-- Admin-only policy (single user v1 - any authenticated user)
CREATE POLICY "admin_full_access" ON categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_full_access" ON tags
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_full_access" ON resources
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_full_access" ON resource_tags
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_full_access" ON ingestion_jobs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_full_access" ON ai_logs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Public read (disabled for v1 - internal tool only)
-- Enable if multi-user support added later

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE resources IS 'Knowledge base resources with AI enrichment';
COMMENT ON COLUMN resources.canonical_url IS 'Normalized URL (no tracking params)';
COMMENT ON COLUMN resources.url_hash IS 'SHA256 hash of canonical_url for deduplication';
COMMENT ON COLUMN resources.needs_review IS 'True when AI failed or confidence < 0.70';
COMMENT ON COLUMN resources.manual_edits IS 'Tracks which fields were manually edited';
COMMENT ON COLUMN resources.updated_by_ai_at IS 'Last AI modification timestamp';
COMMENT ON COLUMN resources.reviewed_at IS 'Last human review timestamp';
