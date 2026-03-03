# Database Schema: Knowledge Graph Studio

**Version:** 1.0
**Phase:** v1.0 MVP
**Owner:** Platform Architect

---

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│   resources     │       │   categories    │
├─────────────────┤       ├─────────────────┤
│ id (uuid)       │       │ id (uuid)       │
│ title (text)    │       │ name (text)     │
│ url (text)      │       │ slug (text)     │
│ description     │       │ parent_id (uuid)│
│ resource_type   │       │ created_at      │
│ category_id     │──────▶│ updated_at      │
│ status          │       └─────────────────┘
│ source          │
│ raw_data (jsonb)│       ┌─────────────────┐
│ ai_summary      │       │     tags        │
│ ai_topics       │       ├─────────────────┤
│ ai_confidence   │       │ id (uuid)       │
│ created_at      │       │ name (text)     │
│ updated_at      │       │ slug (text)     │
└─────────────────┘       │ color (text)    │
         │                │ created_at      │
         │                └─────────────────┘
         │                        ▲
         │                        │
         │                ┌─────────────────┐
         │                │resource_tags    │
         │                ├─────────────────┤
         └───────────────▶│ resource_id     │
                          │ tag_id          │
                          │ created_at      │
                          └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│  ingestion_jobs │       │    ai_logs      │
├─────────────────┤       ├─────────────────┤
│ id (uuid)       │       │ id (uuid)       │
│ source_type     │       │ resource_id     │
│ file_name       │       │ job_type        │
│ total_count     │       │ model_used      │
│ processed_count │       │ tokens_in       │
│ status          │       │ tokens_out      │
│ started_at      │       │ cost            │
│ completed_at    │       │ latency_ms      │
│ created_at      │       │ success         │
└─────────────────┘       │ created_at      │
                          └─────────────────┘
```

---

## Table Definitions

### resources

```sql
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  canonical_url TEXT NOT NULL,        -- normalized URL (no tracking params)
  url_hash TEXT NOT NULL,             -- SHA256 hash of canonical_url (for dedup)
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
    'pending',      -- newly ingested, awaiting AI
    'processing',   -- AI job in progress
    'review',       -- AI complete, needs human review
    'approved',     -- human approved
    'rejected',     -- human rejected
    'archived'      -- no longer relevant
  )),
  needs_review BOOLEAN NOT NULL DEFAULT false,  -- requires human review
  source TEXT NOT NULL CHECK (source IN ('notion_csv', 'json_import', 'manual')),
  raw_data JSONB,              -- original import data
  ai_summary TEXT,             -- AI-generated summary
  ai_topics TEXT[],            -- AI-extracted key topics
  ai_confidence NUMERIC(3,2),  -- AI confidence score (0.00-1.00)
  ai_model_used TEXT,          -- which model processed this
  manual_edits JSONB,          -- tracks which fields were manually edited
  notes TEXT,                  -- manual notes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by_ai_at TIMESTAMPTZ,        -- last AI update timestamp
  reviewed_at TIMESTAMPTZ              -- last human review timestamp
);

-- Indexes
CREATE UNIQUE INDEX idx_resources_url_hash ON resources(url_hash);  -- Prevent duplicates
CREATE INDEX idx_resources_canonical_url ON resources(canonical_url);
CREATE INDEX idx_resources_category ON resources(category_id);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_needs_review ON resources(needs_review) WHERE needs_review = true;
CREATE INDEX idx_resources_type ON resources(resource_type);
CREATE INDEX idx_resources_source ON resources(source);
CREATE INDEX idx_resources_url ON resources(url);
CREATE INDEX idx_resources_ai_topics ON resources USING GIN(ai_topics);
CREATE INDEX idx_resources_search ON resources USING GIN(
  to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(ai_summary, ''))
);
```

### categories

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES categories(id),
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,  -- allows deactivating without deleting
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);

-- Seed data (controlled vocabulary - AI cannot create new categories)
INSERT INTO categories (name, slug, description, is_active) VALUES
  ('OpenClaw', 'openclaw', 'OpenClaw framework, skills, memory, tooling', true),
  ('Development', 'development', 'Development tools, libraries, frameworks', true),
  ('AI/ML', 'ai-ml', 'AI models, ML tools, LLM resources', true),
  ('Documentation', 'documentation', 'Guides, tutorials, reference docs', true),
  ('Infrastructure', 'infrastructure', 'DevOps, hosting, deployment', true),
  ('Design', 'design', 'UI/UX, design systems, tools', true),
  ('Productivity', 'productivity', 'Tools for personal/work efficiency', true),
  ('Learning', 'learning', 'Courses, books, educational content', true);
```

### tags

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#6366f1',  -- Tailwind indigo-500
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tags_slug ON tags(slug);

-- Resource-Tag junction table
CREATE TABLE resource_tags (
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  source TEXT NOT NULL CHECK (source IN ('ai', 'manual')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (resource_id, tag_id)
);

-- Indexes
CREATE INDEX idx_resource_tags_resource ON resource_tags(resource_id);
CREATE INDEX idx_resource_tags_tag ON resource_tags(tag_id);
```

### ingestion_jobs

```sql
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

-- Indexes
CREATE INDEX idx_ingestion_jobs_status ON ingestion_jobs(status);
CREATE INDEX idx_ingestion_jobs_created ON ingestion_jobs(created_at);
```

### ai_logs

```sql
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
  raw_response JSONB,  -- sanitized, no PII
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ai_logs_resource ON ai_logs(resource_id);
CREATE INDEX idx_ai_logs_job_type ON ai_logs(job_type);
CREATE INDEX idx_ai_logs_model ON ai_logs(model_used);
CREATE INDEX idx_ai_logs_created ON ai_logs(created_at);

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
GROUP BY DATE(created_at), model_used, job_type;
```

---

## Row-Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingestion_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;

-- Admin-only policy (single user v1)
CREATE POLICY "admin_full_access" ON resources
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "admin_full_access" ON categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "admin_full_access" ON tags
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "admin_full_access" ON resource_tags
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "admin_full_access" ON ingestion_jobs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "admin_full_access" ON ai_logs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Public read (optional, for future multi-user)
-- Currently disabled for v1
```

---

## Phase 2 Schema (Embeddings + Relationships)

```sql
-- Future tables (Phase 2)

-- Embeddings for semantic search
ALTER TABLE resources ADD COLUMN embedding vector(1536);  -- OpenAI embedding size
CREATE INDEX idx_resources_embedding ON resources USING ivfflat (embedding vector_cosine_ops);

-- Explicit relationships (manual + AI-inferred)
CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_resource_id UUID REFERENCES resources(id),
  target_resource_id UUID REFERENCES resources(id),
  relationship_type TEXT NOT NULL CHECK (relationship_type IN (
    'references',
    'extends',
    'depends_on',
    'related_to',
    'duplicate_of',
    'supersedes'
  )),
  confidence NUMERIC(3,2),
  source TEXT NOT NULL CHECK (source IN ('ai', 'manual')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_resource_id, target_resource_id, relationship_type)
);

CREATE INDEX idx_relationships_source ON relationships(source_resource_id);
CREATE INDEX idx_relationships_target ON relationships(target_resource_id);
```

---

**Schema Version:** 1.0
**Status:** Ready for migration generation
**Next:** Generate Supabase migrations in `/infra/supabase/migrations/`
