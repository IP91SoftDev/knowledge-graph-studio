-- Knowledge Graph Studio - Seed Data
-- Migration: 0002_seed_data
-- Date: 2026-03-02

-- ============================================
-- DEFAULT TAGS (Common starting tags)
-- ============================================

INSERT INTO tags (name, slug, color) VALUES
  ('OpenClaw', 'openclaw', '#8b5cf6'),
  ('Skills', 'skills', '#6366f1'),
  ('Memory', 'memory', '#ec4899'),
  ('Soul', 'soul', '#f43f5e'),
  ('Tooling', 'tooling', '#14b8a6'),
  ('Framework', 'framework', '#06b6d4'),
  ('Documentation', 'docs', '#3b82f6'),
  ('GitHub', 'github', '#1f2937'),
  ('Repository', 'repository', '#6b7280'),
  ('Guide', 'guide', '#10b981'),
  ('Tutorial', 'tutorial', '#84cc16'),
  ('API', 'api', '#f59e0b'),
  ('CLI', 'cli', '#ef4444'),
  ('SDK', 'sdk', '#8b5cf6'),
  ('Template', 'template', '#06b6d4'),
  ('Example', 'example', '#14b8a6'),
  ('Reference', 'reference', '#6366f1'),
  ('Best Practices', 'best-practices', '#3b82f6'),
  ('Architecture', 'architecture', '#8b5cf6'),
  ('DevOps', 'devops', '#f97316'),
  ('Testing', 'testing', '#ec4899'),
  ('Security', 'security', '#ef4444'),
  ('Performance', 'performance', '#10b981'),
  ('AI', 'ai', '#6366f1'),
  ('LLM', 'llm', '#8b5cf6'),
  ('Prompt', 'prompt', '#ec4899'),
  ('Agent', 'agent', '#14b8a6'),
  ('Workflow', 'workflow', '#06b6d4'),
  ('Automation', 'automation', '#10b981'),
  ('Integration', 'integration', '#3b82f6');

-- ============================================
-- SAMPLE RESOURCES (For testing)
-- ============================================

-- Get category IDs for references
DO $$
DECLARE
  openclaw_cat UUID;
  dev_cat UUID;
  ai_cat UUID;
  docs_cat UUID;
BEGIN
  SELECT id INTO openclaw_cat FROM categories WHERE slug = 'openclaw';
  SELECT id INTO dev_cat FROM categories WHERE slug = 'development';
  SELECT id INTO ai_cat FROM categories WHERE slug = 'ai-ml';
  SELECT id INTO docs_cat FROM categories WHERE slug = 'documentation';

  -- OpenClaw Resources
  INSERT INTO resources (title, url, canonical_url, url_hash, description, resource_type, category_id, status, source, ai_confidence, reviewed_at)
  VALUES 
    ('OpenClaw Documentation', 'https://docs.openclaw.ai', 'https://docs.openclaw.ai', encode(sha256('https://docs.openclaw.ai'), 'hex'), 'Official OpenClaw documentation', 'documentation', openclaw_cat, 'approved', 'manual', 1.0, NOW()),
    ('OpenClaw GitHub', 'https://github.com/openclaw/openclaw', 'https://github.com/openclaw/openclaw', encode(sha256('https://github.com/openclaw/openclaw'), 'hex'), 'OpenClaw core repository', 'repository', openclaw_cat, 'approved', 'manual', 1.0, NOW()),
    ('OpenClaw Skills', 'https://docs.openclaw.ai/skills', 'https://docs.openclaw.ai/skills', encode(sha256('https://docs.openclaw.ai/skills'), 'hex'), 'OpenClaw skills documentation', 'documentation', openclaw_cat, 'approved', 'manual', 1.0, NOW());

  -- Development Resources
  INSERT INTO resources (title, url, canonical_url, url_hash, description, resource_type, category_id, status, source, ai_confidence, reviewed_at)
  VALUES 
    ('TypeScript Docs', 'https://www.typescriptlang.org/docs/', 'https://www.typescriptlang.org/docs', encode(sha256('https://www.typescriptlang.org/docs/'), 'hex'), 'TypeScript official documentation', 'documentation', dev_cat, 'approved', 'manual', 1.0, NOW()),
    ('Next.js Docs', 'https://nextjs.org/docs', 'https://nextjs.org/docs', encode(sha256('https://nextjs.org/docs'), 'hex'), 'Next.js 14+ App Router documentation', 'documentation', dev_cat, 'approved', 'manual', 1.0, NOW()),
    ('Turborepo Docs', 'https://turbo.build/repo/docs', 'https://turbo.build/repo/docs', encode(sha256('https://turbo.build/repo/docs'), 'hex'), 'Turborepo monorepo documentation', 'documentation', dev_cat, 'approved', 'manual', 1.0, NOW());

  -- AI/ML Resources
  INSERT INTO resources (title, url, canonical_url, url_hash, description, resource_type, category_id, status, source, ai_confidence, reviewed_at)
  VALUES 
    ('OpenAI API', 'https://platform.openai.com/docs', 'https://platform.openai.com/docs', encode(sha256('https://platform.openai.com/docs'), 'hex'), 'OpenAI API documentation', 'documentation', ai_cat, 'approved', 'manual', 1.0, NOW()),
    ('Anthropic Claude', 'https://docs.anthropic.com/claude/docs', 'https://docs.anthropic.com/claude/docs', encode(sha256('https://docs.anthropic.com/claude/docs'), 'hex'), 'Claude API documentation', 'documentation', ai_cat, 'approved', 'manual', 1.0, NOW());

  -- Link tags to resources
  INSERT INTO resource_tags (resource_id, tag_id, source)
  SELECT r.id, t.id, 'manual'
  FROM resources r
  CROSS JOIN tags t
  WHERE (r.slug = 'openclaw' AND t.slug IN ('openclaw', 'framework', 'documentation'))
     OR (r.slug = 'typescript' AND t.slug IN ('typescript', 'language'))
     OR (r.slug = 'nextjs' AND t.slug IN ('nextjs', 'react', 'framework'));
END $$;

-- ============================================
-- ADMIN USER (Supabase Auth - manual setup)
-- ============================================

-- Note: Supabase Auth users are created via Auth UI or API
-- This is a placeholder for the admin user email
-- Run this in Supabase Dashboard > Authentication > Users
-- Or use the Supabase CLI:
--   supabase auth signup --email admin@example.com --password <secure-password>

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify categories
-- SELECT COUNT(*) FROM categories; -- Should be 8

-- Verify tags
-- SELECT COUNT(*) FROM tags; -- Should be 30

-- Verify sample resources
-- SELECT COUNT(*) FROM resources; -- Should be 8

-- Verify RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
