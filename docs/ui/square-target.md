# Square UI Target Specification

**Date:** 2026-03-03  
**Reference:** https://square-ui-marketing-dashboard.vercel.app/  
**Status:** Implementation In Progress

---

## Target Look & Behavior

### Primary Reference: Marketing Dashboard

**Live Demo:** https://square-ui-marketing-dashboard.vercel.app/

**Why This Template:**
- Clean sidebar-first navigation
- Dense KPI cards (4-up layout)
- Modern data tables with filters
- shadcn/ui component patterns
- Professional spacing & typography

---

## What We're Matching

### ✅ Layout Structure
- [x] Fixed left sidebar (256px / w-64)
- [x] Brand at top of sidebar only
- [x] No top navigation bar
- [x] Profile in sidebar footer
- [x] Sidebar toggle button
- [ ] Dark/light theme toggle (TODO)
- [ ] Theme persistence (TODO)

### ✅ Dashboard KPI Cards
- [ ] 4-up grid layout on desktop
- [ ] Responsive (2-up tablet, 1-up mobile)
- [ ] Icon + label + value + trend
- [ ] Subtle borders & shadows
- [ ] Hover states

### ✅ Data Tables
- [ ] Dense row height
- [ ] Sortable columns
- [ ] Filter bar above table
- [ ] Pagination (bottom right)
- [ ] Status badges/chips
- [ ] Row actions (dropdown)

### ✅ Typography & Spacing
- [ ] Font: Inter (default shadcn)
- [ ] H1: text-2xl font-bold
- [ ] H2: text-xl font-semibold
- [ ] Body: text-base text-gray-600
- [ ] Small: text-sm text-gray-500
- [ ] Consistent padding: px-4 py-6

### ✅ Components (shadcn/ui)
- [ ] Card
- [ ] Button
- [ ] Input
- [ ] Select
- [ ] Badge
- [ ] Dropdown Menu
- [ ] Dialog
- [ ] Table
- [ ] Pagination

---

## Components Used

### From shadcn/ui

```bash
# Install commands for reference
npx shadcn-ui@latest add card
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add table
npx shadcn-ui@latest add pagination
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add skeleton
```

### Custom Components

| Component | Location | Status |
|-----------|----------|--------|
| `AppShell` | `apps/web/components/layout/AppShell.tsx` | ✅ Done |
| `StatCard` | `apps/web/components/ui/StatCard.tsx` | TODO |
| `DataTable` | `apps/web/components/ui/DataTable.tsx` | TODO |
| `FilterBar` | `apps/web/components/ui/FilterBar.tsx` | TODO |

---

## Theme Implementation

### Current State
- Light mode only
- No theme toggle

### TODO: Dark/Light Theme

**Implementation Plan:**

1. **Add next-themes**
   ```bash
   pnpm add next-themes
   ```

2. **Create ThemeProvider**
   ```tsx
   // apps/web/components/theme/ThemeProvider.tsx
   'use client';
   import { ThemeProvider as NextThemesProvider } from 'next-themes';
   
   export function ThemeProvider({ children, ...props }) {
     return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
   }
   ```

3. **Add Theme Toggle to Sidebar**
   ```tsx
   // In AppShell.tsx sidebar footer
   import { useTheme } from 'next-themes';
   
   const { theme, setTheme } = useTheme();
   
   <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
     {theme === 'dark' ? '☀️' : '🌙'}
   </Button>
   ```

4. **Persist Theme**
   - next-themes handles localStorage automatically
   - Add `enableSystem={false}` to disable system preference

5. **Update tailwind.config.ts**
   ```ts
   module.exports = {
     darkMode: 'class',
     // ... rest of config
   }
   ```

---

## Dashboard Layout Patterns

### KPI Cards Row (4-up)

```tsx
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <StatCard
    label="Total Resources"
    value={totalResources}
    trend="+12%"
    icon="📚"
  />
  <StatCard
    label="Pending Review"
    value={pendingCount}
    trend="-5%"
    icon="⏳"
  />
  <StatCard
    label="Approved"
    value={approvedCount}
    trend="+8%"
    icon="✅"
  />
  <StatCard
    label="AI Cost Today"
    value={`$${aiBudget.spent}`}
    trend={`${Math.round((aiBudget.spent / aiBudget.limit) * 100)}% of budget`}
    icon="💰"
  />
</div>
```

### Data Table Pattern

```tsx
<Card>
  <CardHeader>
    <FilterBar
      search={{ placeholder: 'Search resources...' }}
      filters={[
        { key: 'status', options: ['pending', 'review', 'approved'] },
        { key: 'category', options: categories },
      ]}
    />
  </CardHeader>
  <CardContent>
    <DataTable
      columns={columns}
      data={resources}
      pagination={{ pageSize: 10 }}
    />
  </CardContent>
</Card>
```

---

## Where We Differ

| Square UI | KGS | Reason |
|-----------|-----|--------|
| Marketing data | Knowledge resources | Different domain |
| Campaign focus | Resource management | Different use case |
| Public demo | Internal admin tool | Access control needed |

---

## Next Steps (Phase B)

1. [ ] Install shadcn/ui components
2. [ ] Create `StatCard` component
3. [ ] Create `DataTable` component
4. [ ] Create `FilterBar` component
5. [ ] Update dashboard with KPI cards
6. [ ] Add theme toggle
7. [ ] Add dark mode styles

---

## Sources

1. **Square UI Marketing Dashboard** — https://square-ui-marketing-dashboard.vercel.app/
2. **Square UI GitHub** — https://github.com/ln-dev7/square-ui
3. **shadcn/ui** — https://ui.shadcn.com
4. **Radix UI** — https://www.radix-ui.com

---

**[UI/UX] STOP — Square UI Target Spec Complete**
