# AI Re-run Policy (Idempotency + Manual Override Protection)

**Version:** 1.0
**Owner:** AI Systems Lead + Architect

---

## Principles

1. **AI never overwrites manual edits without explicit confirmation**
2. **Re-runs are idempotent** — running twice produces same result
3. **Manual edits are tracked** — know which fields were touched by humans
4. **Review workflow is clear** — user knows when AI vs. human last modified

---

## Manual Edits Tracking

```typescript
// packages/types/src/resource.ts

export interface ManualEdits {
  title?: { edited: true; editedAt: string };
  description?: { edited: true; editedAt: string };
  category?: { edited: true; editedAt: string; previousValue: string };
  tags?: { edited: true; editedAt: string; previousValue: string[] };
  resourceType?: { edited: true; editedAt: string; previousValue: string };
  aiSummary?: { edited: true; editedAt: string; previousValue: string };
  aiTopics?: { edited: true; editedAt: string; previousValue: string[] };
}
```

**Database Storage:**
```sql
manual_edits JSONB  -- stores ManualEdits interface
```

---

## AI Update Logic (Idempotent)

```typescript
// packages/ai/src/update-resource.ts

interface UpdateOptions {
  forceOverwrite?: boolean;  // User explicitly confirmed overwrite
  skipManualFields?: boolean; // Skip fields with manual edits
}

export async function updateResourceWithAI(
  resourceId: string,
  aiResult: CategorizationResult,
  options: UpdateOptions = {}
) {
  const supabase = createClient();

  // Fetch current resource
  const { data: resource } = await supabase
    .from('resources')
    .select('*, manual_edits')
    .eq('id', resourceId)
    .single();

  const manualEdits = (resource.manual_edits as ManualEdits) || {};
  const updateData: any = {
    updated_by_ai_at: new Date().toISOString()
  };
  const newManualEdits = { ...manualEdits };

  // Category
  if (!manualEdits.category || options.forceOverwrite) {
    updateData.category_id = await resolveCategory(aiResult.category);
    if (manualEdits.category && options.forceOverwrite) {
      newManualEdits.category = undefined; // Clear manual edit flag
    }
  }

  // Resource Type
  if (!manualEdits.resourceType || options.forceOverwrite) {
    updateData.resource_type = aiResult.resourceType;
    if (manualEdits.resourceType && options.forceOverwrite) {
      newManualEdits.resourceType = undefined;
    }
  }

  // AI Summary
  if (!manualEdits.aiSummary || options.forceOverwrite) {
    updateData.ai_summary = aiResult.summary;
    if (manualEdits.aiSummary && options.forceOverwrite) {
      newManualEdits.aiSummary = undefined;
    }
  }

  // AI Topics
  if (!manualEdits.aiTopics || options.forceOverwrite) {
    updateData.ai_topics = aiResult.topics;
    if (manualEdits.aiTopics && options.forceOverwrite) {
      newManualEdits.aiTopics = undefined;
    }
  }

  // Confidence (always update, not user-editable)
  updateData.ai_confidence = aiResult.confidence;
  updateData.ai_model_used = aiResult.model;

  // Save
  await supabase
    .from('resources')
    .update({
      ...updateData,
      manual_edits: newManualEdits
    })
    .eq('id', resourceId);
}
```

---

## UI: Manual Edit Flow

### Resource Detail Page

**Editable Fields:**
- Title
- Description
- Category (dropdown)
- Tags (multi-select)
- Resource Type (dropdown)
- AI Summary (textarea)
- AI Topics (tag input)
- Notes

**On Edit:**
```typescript
async function handleFieldEdit(field: string, newValue: any) {
  const currentResource = await fetchResource(id);
  
  // Track manual edit
  const manualEdits = currentResource.manual_edits || {};
  manualEdits[field] = {
    edited: true,
    editedAt: new Date().toISOString(),
    previousValue: currentResource[field]
  };

  // Update resource
  await supabase
    .from('resources')
    .update({
      [field]: newValue,
      manual_edits: manualEdits,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', id);

  // If status was 'approved', keep it approved
  // If status was 'review', user is reviewing → can approve
}
```

---

## UI: AI Re-run Flow

### "Re-run AI" Button

**Location:** Resource detail page, near AI-generated fields

**Behavior:**

1. **Check for manual edits:**
   ```typescript
   const hasManualEdits = Object.keys(resource.manual_edits || {}).length > 0;
   ```

2. **If no manual edits:**
   - Show simple confirmation: "Re-run AI categorization?"
   - On confirm → call AI, update fields

3. **If has manual edits:**
   - Show warning dialog:
     ```
     ⚠️ Manual Edits Detected

     The following fields have been manually edited:
     - Category (edited 2 days ago)
     - AI Summary (edited 5 hours ago)

     Re-running AI will overwrite these fields.

     [Cancel]  [Re-run and Overwrite]
     ```
   - User must explicitly confirm overwrite
   - On confirm → call AI with `forceOverwrite: true`

---

## UI: Bulk AI Re-run

**Location:** Browse page, bulk actions

**Behavior:**

1. User selects multiple resources
2. Clicks "Re-run AI" in bulk actions
3. Summary dialog:
   ```
   Re-run AI on 47 resources?

   - 32 resources: No manual edits (will update)
   - 15 resources: Have manual edits (will skip)

   [ ] Force overwrite manual edits (applies to all)

   [Cancel]  [Re-run AI]
   ```
4. On confirm → process batch

---

## Status Transitions

```
┌─────────────┐
│  pending    │ ──AI success, confidence ≥0.70──▶ ┌─────────────┐
│  (new)      │                                    │  approved   │
└─────────────┘                                    └─────────────┘
       │                                                 │
       │ AI fail OR confidence <0.70                     │ User edits
       ▼                                                 ▼
┌─────────────┐                                   ┌─────────────┐
│   review    │◀──────────────────────────────────│   review    │
│  (needs     │                                   │  (editing)  │
│   review)   │                                   └─────────────┘
└─────────────┘                                          │
       │                                                  │ User approves
       │ User approves                                    ▼
       ▼                                           ┌─────────────┐
┌─────────────┐                                     │  approved   │
│  approved   │                                     └─────────────┘
└─────────────┘
```

---

## Audit Trail

**Timestamps:**
- `created_at` — Resource created
- `updated_at` — Any update (auto-updated by trigger)
- `updated_by_ai_at` — Last AI modification
- `reviewed_at` — Last human review/approval

**Query Examples:**
```sql
-- Resources edited by AI in last 24h
SELECT * FROM resources 
WHERE updated_by_ai_at > NOW() - INTERVAL '24 hours';

-- Resources pending human review
SELECT * FROM resources 
WHERE needs_review = true 
ORDER BY updated_by_ai_at DESC;

-- Resources with manual edits
SELECT * FROM resources 
WHERE manual_edits IS NOT NULL 
  AND jsonb_object_length(manual_edits) > 0;
```

---

**Policy Version:** 1.0
**Effective:** Immediately
**Enforcement:** Code-level (update logic) + UI (confirmation dialogs)
