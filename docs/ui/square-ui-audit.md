# Square UI Audit Report

**Date:** 2026-03-03  
**Project:** Knowledge Graph Studio  
**Design Direction:** Square UI (shadcn/ui + Next.js + Tailwind CSS)

---

## Executive Summary

Square UI is a collection of beautifully crafted open-source layouts built with **Next.js**, **shadcn/ui**, and **Tailwind CSS**. It provides production-ready templates for dashboards, admin panels, and data management interfaces.

**Source:** https://github.com/ln-dev7/square-ui

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14+ (App Router) |
| UI Components | shadcn/ui (Radix UI primitives) |
| Styling | Tailwind CSS |
| Language | TypeScript |
| Icons | Lucide React |

---

## Relevant Templates for Knowledge Graph Studio

### 1. Dashboard 5 ⭐ (Primary Reference)
**Live Demo:** https://square-ui-dashboard-5.vercel.app  
**Why Relevant:** Modern dashboard with stats, tasks, performance chart, and projects table — matches our resource management needs.

**Key Patterns to Adopt:**
- Top stats cards row
- Chart area for trends
- Table with filters
- Clean card-based layout

### 2. Bookmarks ⭐ (High Priority)
**Live Demo:** https://square-ui-bookmarks.vercel.app  
**Why Relevant:** Bookmarks manager with collections, tags, favorites, archive — directly maps to our resource categorization system.

**Key Patterns to Adopt:**
- Collection/group sidebar
- Tag filtering system
- Card grid + list view toggle
- Search with filters

### 3. Dashboard 2 (CRM Style)
**Live Demo:** https://square-ui-dashboard-2.vercel.app  
**Why Relevant:** Revenue charts, lead sources, deals table with pagination — good for our analytics page.

**Key Patterns to Adopt:**
- Multi-chart dashboard
- Data table with pagination
- Filter bar patterns

### 4. Files
**Live Demo:** https://square-ui-files.vercel.app  
**Why Relevant:** File manager with folders, storage overview, grid/list view — similar to our resource browsing needs.

**Key Patterns to Adopt:**
- Folder navigation sidebar
- Grid/list view toggle
- Breadcrumb navigation
- Action toolbar

---

## Components We Need to Add to @repo/ui

### Phase A: App Shell + Navigation
| Component | Priority | Source |
|-----------|----------|--------|
| `AppShell` | Critical | Dashboard 5 |
| `Sidebar` | Critical | Bookmarks, Files |
| `TopNav` | Critical | Dashboard 5 |
| `PageHeader` | High | All templates |
| `Breadcrumb` | High | Files |
| `ActionBar` | Medium | All templates |

### Phase B: Dashboard Widgets
| Component | Priority | Source |
|-----------|----------|--------|
| `StatCard` | Critical | Dashboard 5 |
| `ChartCard` | High | Dashboard 2, 3, 4, 5 |
| `ActivityFeed` | Medium | Dashboard 1 |
| `QuickActions` | Medium | Dashboard 5 |

### Phase C: Tables + Filters
| Component | Priority | Source |
|-----------|----------|--------|
| `DataTable` | Critical | All dashboards |
| `FilterBar` | Critical | Bookmarks, Leads |
| `SearchInput` | High | All templates |
| `Pagination` | High | All dashboards |
| `EmptyState` | Medium | All templates |

---

## Layout Structure Standardization

### Recommended App Shell Structure

```
┌─────────────────────────────────────────────────────────────┐
│                      Top Navigation                         │
│  [Logo]  [Search]              [Notifications] [Profile ▼] │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│  Sidebar │              Main Content Area                   │
│          │                                                  │
│  - Dash  │  ┌─────────────────────────────────────────┐    │
│  - Browse│  │           Page Header                   │    │
│  - Search│  │  [Title] [Breadcrumbs] [Actions]        │    │
│  - Ingest│  └─────────────────────────────────────────┘    │
│  - Analytics│                                               │
│          │  ┌─────────────────────────────────────────┐    │
│  Settings│  │           Content Body                  │    │
│          │  │  (Cards, Tables, Charts, Forms)         │    │
│          │  └─────────────────────────────────────────┘    │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

### Page Layout Pattern

```tsx
<AppShell>
  <PageHeader
    title="Dashboard"
    breadcrumbs={[{ label: 'Home', href: '/' }]}
    actions={<Button>Import</Button>}
  />
  
  <ContentArea>
    {/* Stats Row */}
    <StatsGrid>...</StatsGrid>
    
    {/* Main Content */}
    <Card>...</Card>
    
    {/* Data Table */}
    <DataTable>...</DataTable>
  </ContentArea>
</AppShell>
```

---

## Implementation Plan

### Phase A: App Shell + Nav + Page Layout (Week 1)
**Goal:** Establish consistent layout foundation

- [ ] Create `AppShell.tsx` component
- [ ] Create `Sidebar.tsx` with navigation
- [ ] Create `TopNav.tsx` with profile menu
- [ ] Create `PageHeader.tsx` with breadcrumbs
- [ ] Update all pages to use AppShell
- [ ] Remove duplicate headers

**Acceptance Criteria:**
- All pages render inside AppShell
- Single navigation system (no duplicates)
- Profile menu accessible from TopNav
- Breadcrumbs work on all pages

### Phase B: Dashboard Widgets (Week 2)
**Goal:** Build reusable dashboard components

- [ ] Create `StatCard.tsx`
- [ ] Create `ChartCard.tsx` (Recharts integration)
- [ ] Create `ActivityFeed.tsx`
- [ ] Update `/` dashboard with new widgets
- [ ] Add responsive grid layouts

**Acceptance Criteria:**
- Dashboard shows 4 stat cards
- Chart displays resource trends
- Activity feed shows recent changes
- Layout is responsive (mobile-friendly)

### Phase C: Tables + Filters + Search (Week 3)
**Goal:** Professional data management UI

- [ ] Create `DataTable.tsx` (TanStack Table)
- [ ] Create `FilterBar.tsx`
- [ ] Create `SearchInput.tsx` with debounce
- [ ] Create `Pagination.tsx`
- [ ] Update `/browse` with new table
- [ ] Add sorting, filtering, search

**Acceptance Criteria:**
- Browse page has sortable table
- Filter by category/status
- Search with instant results
- Pagination works correctly

---

## Design Tokens (Recommended)

### Spacing Scale
```ts
const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
};
```

### Typography
```ts
const typography = {
  h1: 'text-3xl font-bold',
  h2: 'text-2xl font-semibold',
  h3: 'text-xl font-semibold',
  body: 'text-base text-gray-600',
  small: 'text-sm text-gray-500',
};
```

### Colors (Align with shadcn/ui)
```ts
const colors = {
  primary: 'indigo-600',
  secondary: 'gray-600',
  success: 'green-600',
  warning: 'yellow-600',
  danger: 'red-600',
  muted: 'gray-100',
};
```

---

## Sources & References

1. **Square UI** — https://github.com/ln-dev7/square-ui
2. **shadcn/ui** — https://ui.shadcn.com
3. **Radix UI** — https://www.radix-ui.com
4. **TanStack Table** — https://tanstack.com/table
5. **Recharts** — https://recharts.org

---

## Notes

- Square UI uses **Radix UI** primitives via shadcn/ui
- All templates are **Next.js App Router** compatible
- Components are **TypeScript-first** with proper types
- Styling uses **Tailwind CSS** utility classes
- Icons are from **Lucide React**

---

**[UI/UX] STOP — Square UI Audit Complete**
