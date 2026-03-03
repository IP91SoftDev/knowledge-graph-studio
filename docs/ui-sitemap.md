# UI Sitemap + User Journeys

**Version:** 1.0
**Phase:** v1.0 MVP
**Owner:** Frontend + PM

---

## Sitemap

```
┌─────────────────────────────────────────────────────────────────┐
│                    KNOWLEDGE GRAPH STUDIO                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐                                                │
│  │  /          │                                                │
│  │  Dashboard  │────────────────────────┐                       │
│  │  (Home)     │                        │                       │
│  └─────────────┘                        │                       │
│         │                               │                       │
│         ├───────────┬───────────┬───────┼───────────┬────────── │
│         │           │           │       │           │           │
│         ▼           ▼           ▼       ▼           ▼           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │  /browse    │ │  /search    │ │  /ingest    │ │  /analytics ││
│  │  Browse     │ │  Search     │ │  Ingest     │ │  Analytics  ││
│  │  by Cat/Tag │ │  Resources  │ │  CSV/JSON   │ │  Stats      ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
│         │               │               │                       │
│         │               │               │                       │
│         ▼               ▼               ▼                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                │
│  │ /resource/  │ │ /resource/  │ │  /jobs/     │                │
│  │ [id]        │ │ [id]        │ │  [jobId]    │                │
│  │ Detail      │ │ Detail      │ │  Job Status │                │
│  │ (from       │ │ (from       │ │  (from      │                │
│  │  browse)    │ │  search)    │ │  ingest)    │                │
│  └─────────────┘ └─────────────┘ └─────────────┘                │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐                               │
│  │  /settings  │  │  /auth/     │                               │
│  │  App Config │  │  Magic Link │                               │
│  └─────────────┘  └─────────────┘                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Page Specifications

### `/` — Dashboard (Home)

**Purpose:** Overview + quick actions

**Components:**
- Stats cards (total resources, by status, by category)
- Recent activity feed (last 10 ingested/updated)
- Quick actions (Upload CSV, Upload JSON, Process Queue)
- AI budget status (spent today, remaining)
- Pending review count (click to browse filtered)

**Data:**
```typescript
{
  totalResources: number;
  byStatus: { pending: number; review: number; approved: number };
  byCategory: Array<{ name: string; count: number }>;
  recentActivity: Array<{ resourceId; title; action; timestamp }>;
  aiBudget: { spent: number; limit: number; remaining: number };
  pendingReview: number;
}
```

---

### `/browse` — Browse Resources

**Purpose:** Explore by category/tag/type

**Components:**
- Filter sidebar:
  - Category (multi-select)
  - Tags (multi-select)
  - Resource Type (multi-select)
  - Status (pending/review/approved/archived)
  - AI Confidence (slider: 0-100%)
- Resource grid/list toggle
- Sort options (newest, oldest, title, confidence)
- Pagination (50 per page)
- Bulk actions (select multiple → approve/reject/tag)

**URL Params:**
```
/browse?category=openclaw&tags=skills,memory&status=review&sort=created_desc
```

---

### `/search` — Search Resources

**Purpose:** Full-text search across resources

**Components:**
- Search input (prominent, auto-focus)
- Search filters (same as browse)
- Results list with highlights
- Relevance sort (default)
- "Did you mean?" suggestions (Phase 2)
- Save search (Phase 2)

**Search Fields:**
- Title
- Description
- AI Summary
- AI Topics
- Tags
- Category

---

### `/resource/[id]` — Resource Detail

**Purpose:** View + edit single resource

**Sections:**

**1. Header**
- Title (editable)
- URL (clickable)
- Status badge
- Quick actions (edit, approve, reject, archive, delete)

**2. Metadata**
- Category (dropdown, editable)
- Tags (multi-select, editable)
- Resource Type (dropdown, editable)
- Source (read-only)
- Created/Updated (read-only)

**3. AI-Generated Content**
- Summary (editable, shows AI confidence)
- Topics (editable, tag-style)
- "Regenerate with AI" button

**4. Raw Data**
- Collapsible JSON view of original import data

**5. Notes**
- Free-text notes (markdown support)

**6. Relationships** (Phase 2)
- Linked resources
- "Add relationship" button

---

### `/ingest` — Ingestion

**Purpose:** Upload CSV/JSON files

**Tabs:**
1. **CSV Upload**
   - Drag-drop zone
   - File format info + example
   - Preview (first 5 rows after parse)
   - Upload button → redirects to job status

2. **JSON Upload**
   - Drag-drop zone
   - File format info + example
   - Preview (first 5 items after parse)
   - Upload button → redirects to job status

3. **Job History**
   - List of past ingestion jobs
   - Status, date, count, errors
   - Click to view job detail

---

### `/jobs/[jobId]` — Job Status

**Purpose:** Track ingestion progress

**Components:**
- Job info (source, file, started, completed)
- Progress bar (percent complete)
- Status breakdown (pending/processing/review/completed/failed)
- Error list (expandable)
- "Process Queue" button (if AI jobs pending)
- "View Resources" button (browse filtered by job)

**Real-time Updates:**
- Poll every 5s while processing
- WebSocket (Phase 2)

---

### `/analytics` — Analytics

**Purpose:** Dashboard stats + AI cost tracking

**Sections:**

**1. Resource Stats**
- Total resources over time (chart)
- By category (pie chart)
- By status (bar chart)
- By source (pie chart)

**2. AI Usage**
- Cost over time (line chart, daily)
- Cost by model (pie chart)
- Requests over time (line chart)
- Average confidence score (gauge)

**3. Export**
- Export filtered resources (CSV/JSON)
- Export AI logs (CSV)

---

### `/settings` — Settings

**Purpose:** App configuration (v1: minimal)

**Sections:**

**1. AI Settings**
- Daily budget ($5 default)
- Cost per resource estimate
- Model preferences (read-only, per policy)

**2. Data Management**
- Export all data (CSV/JSON)
- Clear all resources (with confirmation)
- Backup reminder

**3. Account**
- Current user (email)
- Logout

---

### `/auth/*` — Auth Flow

**Pages:**
- `/auth/login` — Magic link request (email input)
- `/auth/verify` — Magic link verification (auto-redirect)
- `/auth/callback` — Post-auth redirect to dashboard

**Flow:**
1. User enters email
2. Supabase sends magic link
3. User clicks link
4. Redirect to dashboard (authenticated)

---

## Primary User Journeys

### Journey 1: Ingest CSV → Review → Approve

```
1. User navigates to /ingest
2. Selects "CSV Upload" tab
3. Drags Notion export CSV
4. Sees preview (first 5 rows)
5. Clicks "Upload"
6. Redirected to /jobs/[jobId]
7. Watches progress bar (real-time)
8. When complete, clicks "View Resources" (filtered by status=review)
9. Browses /browse with review filter
10. Clicks individual resource to /resource/[id]
11. Reviews AI categorization
12. Edits category/tags if needed
13. Clicks "Approve"
14. Resource status → approved
15. Repeats for remaining review items
```

**Time Estimate:** 2-3 min per 100 resources (with AI assist)

---

### Journey 2: Search → Find → Export

```
1. User navigates to /search
2. Enters search query (e.g., "OpenClaw skills")
3. Sees results with highlights
4. Applies filters (category=openclaw, status=approved)
5. Selects multiple resources (checkboxes)
6. Clicks "Export Selected"
7. Chooses format (CSV/JSON/OpenClaw-ready)
8. Downloads file
```

**Time Estimate:** <1 min

---

### Journey 3: Browse → Discover → Edit

```
1. User navigates to /browse
2. Selects category "AI/ML"
3. Sees grid of resources
4. Clicks resource card → /resource/[id]
5. Notices AI summary is inaccurate
6. Clicks "Regenerate with AI"
7. Waits for regeneration
8. Reviews new summary
9. Manually edits if still off
10. Saves changes
```

**Time Estimate:** 1-2 min per edit

---

## Component Library

**Shared UI Components (packages/ui):**
- `ResourceCard` — Card view for browse
- `ResourceRow` — Row view for browse
- `ResourceDetail` — Full detail view
- `CategoryFilter` — Multi-select category filter
- `TagFilter` — Multi-select tag filter
- `StatusBadge` — Status indicator
- `ConfidenceGauge` — AI confidence visual
- `ProgressBar` — Job progress
- `StatsCard` — Dashboard stat
- `UploadZone` — Drag-drop upload
- `SearchInput` — Search with filters
- `BulkActionBar` — Bulk actions toolbar

---

## Responsive Design

| Breakpoint | Layout |
|------------|--------|
| Desktop (≥1024px) | Full sidebar + main content |
| Tablet (768-1023px) | Collapsible sidebar |
| Mobile (<768px) | Bottom nav + stacked content |

**Note:** Primary use is desktop (admin tool), but mobile-responsive for on-the-go review.

---

**UI Version:** 1.0
**Status:** Ready for implementation
**Next:** Build Next.js app skeleton + auth
