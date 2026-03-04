# Web Snapshot Workflow

**Purpose:** Safely capture and analyze external UI references for implementation guidance.

**Security:** SSRF-protected, domain-allowlisted, no credentials.

---

## Quick Start

### Capture a Snapshot

```bash
pnpm web:snapshot <url>
```

**Example:**
```bash
pnpm web:snapshot https://square-ui-marketing-dashboard.vercel.app/
```

**Output:**
```
📸 Capturing snapshot: https://square-ui-marketing-dashboard.vercel.app/
🌐 Launching browser...
📄 Loading page...
📷 Taking screenshot...
💾 Saving HTML snapshot...
📦 Capturing storage state...

✅ Snapshot saved to:
   docs/snapshots/2026-03-03T15-30-00-abc12345

Files created:
   - screenshot.png (full page)
   - snapshot.html (HTML source)
   - storage.json (localStorage/sessionStorage)
   - metadata.json (URL, timestamp, title)
```

---

### Analyze a Snapshot

```bash
pnpm ui:analyze <snapshot-dir>
```

**Example:**
```bash
pnpm ui:analyze docs/snapshots/2026-03-03T15-30-00-abc12345
```

**Output:**
```
🔍 Analyzing: docs/snapshots/2026-03-03T15-30-00-abc12345

✅ Analysis complete!
   Report saved to: docs/snapshots/2026-03-03T15-30-00-abc12345/ui-report.md

Summary:
   Layout: Sidebar=true, Header=true, Main=true
   Theme: Dark=true, Toggle=true
   Components: Cards=12, Tables=2, Buttons=8
```

---

## Security Model

### Domain Allowlist

Only these domains can be captured:

```typescript
const ALLOWLIST = new Set([
  // Square UI templates
  'square-ui-marketing-dashboard.vercel.app',
  'square-ui-dashboard-5.vercel.app',
  'square-ui-bookmarks.vercel.app',
  // ... (see tools/web-snapshot.ts for full list)
  
  // Vercel previews
  '*.vercel.app',
  
  // Reference sites
  'github.com',
  'ui.shadcn.com',
  'www.radix-ui.com',
]);
```

### SSRF Protection

Blocked patterns:
- ❌ `localhost`, `127.0.0.1`
- ❌ Private IPs: `10.x.x.x`, `192.168.x.x`, `172.16-31.x.x`
- ❌ Link-local: `169.254.x.x`, `fe80::/10`
- ❌ IPv6 localhost: `::1`
- ❌ Raw IP addresses

### Additional Safeguards

| Protection | Implementation |
|------------|----------------|
| HTTPS only | `protocol !== 'https:'` → reject |
| No cookies | Playwright launched without storage |
| No forms | Read-only page navigation |
| No scripts | Normal page load only (no eval) |
| Headless | No UI automation visible |

---

## Output Structure

```
docs/snapshots/
└── 2026-03-03T15-30-00-abc12345/
    ├── screenshot.png      # Full-page screenshot
    ├── snapshot.html       # Complete HTML source
    ├── storage.json        # localStorage/sessionStorage
    ├── metadata.json       # URL, timestamp, title
    └── ui-report.md        # Analysis report (after ui:analyze)
```

---

## When to Use

### ✅ Appropriate Use Cases

- Capturing UI inspiration from design galleries
- Analyzing component patterns from open-source demos
- Documenting reference implementations
- Extracting layout structures for replication

### ❌ Inappropriate Use Cases

- Capturing authenticated pages (no cookies sent)
- Scraping data from sites (use APIs instead)
- Testing your own deployed app (use browser DevTools)
- Capturing non-allowlisted domains (request addition)

---

## Adding New Domains

To capture a new domain, edit `tools/web-snapshot.ts`:

```typescript
const ALLOWLIST = new Set([
  // Add your domain here:
  'new-domain.vercel.app',
  
  // Existing domains...
]);
```

**Criteria for allowlisting:**
- Must be a public demo/gallery site
- Must use HTTPS
- Must not require authentication
- Must be relevant to UI/UX reference

---

## Integration with Development Workflow

### 1. Capture Reference

```bash
pnpm web:snapshot https://square-ui-marketing-dashboard.vercel.app/
```

### 2. Analyze Patterns

```bash
pnpm ui:analyze docs/snapshots/2026-03-03T15-30-00-abc12345
```

### 3. Review Report

Open `ui-report.md` for:
- Layout structure analysis
- Component inventory
- Spacing scale guesses
- Implementation recommendations

### 4. Implement

Use findings to update:
- `docs/ui/square-target.md` (design spec)
- `apps/web/components/` (component implementation)
- `apps/web/app/` (page layouts)

---

## Troubleshooting

### "Host not allowlisted"

**Solution:** Add the domain to `ALLOWLIST` in `tools/web-snapshot.ts`

### "Blocked hostname (SSRF protection)"

**Solution:** This is a security feature. Private/internal IPs are blocked.

### "Timeout waiting for networkidle"

**Solution:** The page may have long-polling or streaming. Try a different URL or increase timeout in `web-snapshot.ts`.

### "Cannot find module 'playwright'"

**Solution:** Install dependencies:
```bash
pnpm install
pnpm exec playwright install chromium
```

---

## Examples

### Capture Square UI Dashboard

```bash
pnpm web:snapshot https://square-ui-dashboard-5.vercel.app/
pnpm ui:analyze docs/snapshots/*
```

### Capture shadcn/ui Documentation

```bash
pnpm web:snapshot https://ui.shadcn.com/docs/components/card
pnpm ui:analyze docs/snapshots/*
```

---

## Related Docs

- [`/docs/ui/square-target.md`](./square-target.md) — Square UI specification
- [`/docs/ui/square-ui-audit.md`](./square-ui-audit.md) — Square UI audit report

---

*Last updated: 2026-03-03*
