# Project Intake: Knowledge Graph Studio

**Intake Date:** 2026-03-02
**Intake Owner:** AURELIUS // Systems Architect
**Complexity Tier:** M (Medium)

---

## 1. Project Overview

**One-Line Description:**
> Internal admin dashboard for ingesting, categorizing, and managing a knowledge base of 1000+ resources with AI-powered enrichment and relationship mapping.

**Problem Statement:**
> IP maintains 1000+ links across Notion databases and JSON lists (resources, GitHub repos, OpenClaw skills/memory/soul/tooling, localhost-public guides). Manual categorization is infeasible. Need a structured system to visualize schemas, categories/tags, relationships, and enable AI-assisted organization for later firm upgrades (skills, memory, playbooks).

**Target Users:**
- Primary: IP (admin only, internal tool)
- Secondary: Future firm agents (read access to curated outputs)

---

## 2. Reference Analysis

**Reference Sites:**
- Notion (database structure, tagging patterns)
- Obsidian/Roam Research (knowledge graph patterns)
- Internal OpenClaw structure (skills/memory/soul/tooling conventions)

**Core User Journeys (5):**
1. **Ingest CSV** → Upload Notion export → AI auto-categorize → Review → Approve/Override
2. **Ingest JSON** → Upload JSON list → AI auto-categorize → Review → Approve/Override
3. **Browse by Category** → Select category → Filter by tags/type → View resources
4. **Search Resources** → Query search → Results with relevance → View detail → Edit metadata
5. **Export Bundle** → Select resources → Generate OpenClaw-ready output → Download/Apply

---

## 3. Scope Boundaries

### In Scope (v1.0 - MVP)
- [ ] CSV ingestion (Notion export format)
- [ ] JSON ingestion (link list format)
- [ ] Supabase PostgreSQL schema (resources, categories, tags, links)
- [ ] AI auto-categorization (category, tags, resource type, summary, key topics)
- [ ] Zod output validation + rate limits + cost caps + fallback
- [ ] Next.js dashboard (App Router)
- [ ] Browse by categories/tags/types
- [ ] Search functionality
- [ ] Resource detail page
- [ ] Manual override/edit of AI fields
- [ ] Supabase Auth (magic link)
- [ ] Supabase RLS (admin-only access)
- [ ] Basic analytics (counts by category, status)

### Out of Scope (v1.0 - Deferred to v1.1+)
- [ ] Embeddings generation (Phase 2)
- [ ] Relationship inference (Phase 2)
- [ ] Graph visualization (Phase 2)
- [ ] Export to OpenClaw formats (Phase 3)
- [ ] Multi-user support (Phase 2)
- [ ] API for external access (Phase 2)

### Explicitly Not Building (Legal Risk)
- [ ] No Notion API integration (CSV export only — user exports manually)
- [ ] No copying of proprietary content (metadata only, not full resource content)

---

## 4. Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Performance (Lighthouse) | ≥90 all categories | Lighthouse CI |
| API Latency (P95) | <500ms | Vercel Analytics |
| AI Categorization Accuracy | ≥85% (human review) | Sample audit (100 resources) |
| Ingestion Throughput | 100 resources/minute | Batch job timing |
| AI Cost per Resource | <$0.005 | Cost tracking logs |
| Daily AI Budget | <$5.00 | Cost caps enforced |
| Time to Categorize 1000 | <2 hours (with AI) | Manual timing |

---

## 5. Technical Requirements

**Auth Model:**
- [x] Magic link (Supabase)
- [ ] OAuth
- [x] Admin tier only (single user v1)

**AI Features:**
- [x] Auto-categorization (category + tags + resource type)
- [x] Summary generation (1-2 sentences)
- [x] Key topics extraction (3-5 keywords)
- [ ] Relationship inference (Phase 2)
- [ ] Embedding generation (Phase 2)

**Integrations:**
- [ ] Stripe (not needed — internal tool)
- [ ] Resend (optional — notifications for batch completion)
- [ ] Cloudflare R2 (optional — store exports)
- [x] Supabase (database + auth)

**Platforms:**
- [x] Web only
- [ ] Mobile (not needed — admin tool)

---

## 6. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| AI miscategorization | Medium | Low | Manual override UI, batch review workflow |
| Cost overrun (AI) | Low | Medium | Cost caps ($5/day), per-resource budget, rate limits |
| Large file ingestion | Medium | Low | Chunked processing, progress tracking, timeout handling |
| Schema drift (Notion export) | Low | Low | Flexible parser, validation with fallback |
| Data loss | Low | High | Supabase backups, export before bulk operations |

---

## 7. Agent Team

| Role | Assigned | Status |
|------|----------|--------|
| CEO | AURELIUS | Active |
| CTO | AURELIUS | Active |
| Architect | AURELIUS | Active |
| PM | AURELIUS | Active |
| Platform Architect | AURELIUS | Active |
| AI Systems Lead | AURELIUS | Active |
| Frontend | AURELIUS | Active |
| Backend | AURELIUS | Active |
| Mobile | — | Dormant |
| QA | AURELIUS | Active |
| DevOps | AURELIUS | Active |
| Security | AURELIUS | Active |

---

## 8. Timeline Estimate

| Phase | Estimated Duration | Target Date |
|-------|-------------------|-------------|
| INTAKE | 1 day | 2026-03-02 |
| STRUCTURAL ANALYSIS | 2 days | 2026-03-04 |
| SYSTEM DESIGN | 2 days | 2026-03-06 |
| BUILD ITERATION 1 | 5 days | 2026-03-11 |
| BUILD ITERATION 2+ | 7 days | 2026-03-18 |
| PRE-LAUNCH | 3 days | 2026-03-21 |
| DEPLOY | 1 day | 2026-03-22 |
| POST-LAUNCH | 2 days | 2026-03-24 |

**Total Estimated Duration:** ~3 weeks

---

## 9. Approval

**CEO Approval:** [ ] Approved [ ] Rejected [ ] Needs Revision
**Date:** YYYY-MM-DD
**Notes:** [any conditions or concerns]

---

**Next Phase:** STRUCTURAL ANALYSIS
**Charter Approved By:** [Pending IP Approval]
**Charter Approved Date:** [Pending]
