# Ingestion Pipeline Design

**Version:** 1.0
**Phase:** v1.0 MVP
**Owner:** Backend + AI Systems Lead

---

## Overview

Two ingestion sources:
1. **Notion CSV Export** — user exports from Notion, uploads to dashboard
2. **JSON List** — raw JSON array of link objects

Both pipelines:
- Parse → Validate → Store (raw) → Queue AI Jobs → Process → Flag for Review

---

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        INGESTION FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │  Upload  │───▶│  Parse   │───▶│ Validate │───▶│  Store   │  │
│  │  (UI)    │    │ (Server) │    │  (Zod)   │    │ (Batch)  │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│                                                        │        │
│                                                        ▼        │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │ Complete │◀───│  Review  │◀───│  Process │◀───│  Queue   │  │
│  │  (UI)    │    │  (Human) │    │   (AI)   │    │  (Jobs)  │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Notion CSV Ingestion

### Expected CSV Format

```csv
Name,URL,Tags,Category,Notes,Created
"OpenClaw Docs","https://docs.openclaw.ai","openclaw,docs,framework","OpenClaw","Main documentation","2024-01-15"
"GitHub Repo","https://github.com/...","code,openclaw,skill","Development","Skill templates","2024-02-20"
```

### URL Canonicalization

```typescript
// packages/ingestion/src/url-canonicalizer.ts

import { createHash } from 'crypto';

export function canonicalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    
    // Lowercase host
    parsed.hostname = parsed.hostname.toLowerCase();
    
    // Remove trailing slash from pathname (unless root)
    if (parsed.pathname.length > 1 && parsed.pathname.endsWith('/')) {
      parsed.pathname = parsed.pathname.slice(0, -1);
    }
    
    // Remove tracking parameters
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign',
      'utm_term', 'utm_content',
      'fbclid', 'gclid', 'mc_cid', 'mc_eid',
      'ref', 'src', 's', 'si'
    ];
    
    trackingParams.forEach(param => {
      parsed.searchParams.delete(param);
    });
    
    // Sort remaining params for consistency
    const sortedParams = new URLSearchParams(
      Array.from(parsed.searchParams.entries()).sort()
    );
    parsed.search = sortedParams.toString();
    
    // Remove hash (fragment)
    parsed.hash = '';
    
    return parsed.toString();
  } catch {
    return url; // Return original if invalid
  }
}

export function urlHash(url: string): string {
  const canonical = canonicalizeUrl(url);
  return createHash('sha256').update(canonical).digest('hex');
}
```

### Parser Implementation

```typescript
// packages/ingestion/src/notion-csv-parser.ts

import { parse } from 'csv-parse/sync';
import { z } from '@repo/validation';
import { canonicalizeUrl, urlHash } from './url-canonicalizer';

const notionRowSchema = z.object({
  Name: z.string().min(1),
  URL: z.string().url(),
  Tags: z.string().optional(),
  Category: z.string().optional(),
  Notes: z.string().optional(),
  Created: z.string().optional()
});

export function parseNotionCSV(content: string) {
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  const validated: Array<{
    title: string;
    url: string;
    canonicalUrl: string;
    urlHash: string;
    tags?: string[];
    category?: string;
    notes?: string;
    raw: Record<string, string>;
  }> = [];

  const errors: Array<{ row: number; error: string }> = [];
  const seenUrls = new Set<string>();
  const duplicates: Array<{ row: number; url: string }> = [];

  records.forEach((row, index) => {
    const result = notionRowSchema.safeParse(row);
    if (result.success) {
      const canonicalUrl = canonicalizeUrl(result.data.URL);
      const hash = urlHash(result.data.URL);
      
      // Check for duplicates within this import
      if (seenUrls.has(hash)) {
        duplicates.push({ row: index + 2, url: result.data.URL });
        return;
      }
      seenUrls.add(hash);
      
      validated.push({
        title: result.data.Name,
        url: result.data.URL,
        canonicalUrl,
        urlHash: hash,
        tags: result.data.Tags?.split(',').map(t => t.trim()).filter(Boolean),
        category: result.data.Category,
        notes: result.data.Notes,
        raw: row
      });
    } else {
      errors.push({
        row: index + 2, // 1-indexed + header
        error: result.error.errors.map(e => e.message).join(', ')
      });
    }
  });

  return { validated, errors, duplicates };
}
```

### Batch Insert Strategy (with Deduplication)

```typescript
// apps/web/app/api/ingestion/notion/route.ts

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const content = await file.text();

  // Parse CSV
  const { validated, errors, duplicates } = parseNotionCSV(content);

  // Create ingestion job
  const job = await supabase
    .from('ingestion_jobs')
    .insert({
      source_type: 'notion_csv',
      file_name: file.name,
      total_count: validated.length,
      status: 'processing'
    })
    .select()
    .single();

  // Check for existing resources (deduplication against database)
  const existingHashes = new Set<string>();
  const { data: existing } = await supabase
    .from('resources')
    .select('url_hash')
    .in('url_hash', validated.map(r => r.urlHash));
  
  existing?.forEach(r => existingHashes.add(r.url_hash));

  // Filter out duplicates
  const newResources = validated.filter(r => !existingHashes.has(r.urlHash));
  const skippedCount = existingHashes.size;

  // Batch insert resources (chunked)
  const CHUNK_SIZE = 100;
  for (let i = 0; i < newResources.length; i += CHUNK_SIZE) {
    const chunk = newResources.slice(i, i + CHUNK_SIZE);
    const resources = chunk.map(r => ({
      title: r.title,
      url: r.url,
      canonical_url: r.canonicalUrl,
      url_hash: r.urlHash,
      description: r.notes,
      resource_type: 'other' as const, // AI will recategorize
      status: 'pending' as const,
      needs_review: false,
      source: 'notion_csv' as const,
      raw_data: r.raw,
      manual_edits: {} // No manual edits yet
    }));

    await supabase.from('resources').insert(resources);
  }

  // Update job with actual counts
  await supabase
    .from('ingestion_jobs')
    .update({
      total_count: newResources.length,
      processed_count: skippedCount // Count skipped as "processed"
    })
    .eq('id', job.id);

  // Queue AI jobs for all pending resources
  await queueAIJobs(job.id);

  return Response.json({
    jobId: job.id,
    total: newResources.length,
    skipped: skippedCount,
    duplicates: duplicates.length,
    errors
  });
}
```

---

## 2. JSON List Ingestion

### Expected JSON Format

```json
[
  {
    "url": "https://...",
    "title": "Resource Title",
    "description": "Optional description",
    "tags": ["tag1", "tag2"],
    "category": "Optional category",
    "metadata": { "any": "extra fields" }
  }
]
```

### Parser Implementation

```typescript
// packages/ingestion/src/json-parser.ts

import { z } from '@repo/validation';

const jsonResourceSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  metadata: z.record(z.unknown()).optional()
});

export function parseJSONList(content: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    return {
      validated: [],
      errors: [{ row: 0, error: 'Invalid JSON' }]
    };
  }

  if (!Array.isArray(parsed)) {
    return {
      validated: [],
      errors: [{ row: 0, error: 'Expected JSON array' }]
    };
  }

  const validated: Array<{
    title: string;
    url: string;
    description?: string;
    tags?: string[];
    category?: string;
    raw: Record<string, unknown>;
  }> = [];

  const errors: Array<{ row: number; error: string }> = [];

  parsed.forEach((item, index) => {
    const result = jsonResourceSchema.safeParse(item);
    if (result.success) {
      validated.push({
        title: result.data.title,
        url: result.data.url,
        description: result.data.description,
        tags: result.data.tags,
        category: result.data.category,
        raw: item as Record<string, unknown>
      });
    } else {
      errors.push({
        row: index + 1,
        error: result.error.errors.map(e => e.message).join(', ')
      });
    }
  });

  return { validated, errors };
}
```

---

## 3. AI Categorization Pipeline

### Job Queue Design

```typescript
// packages/ai/src/categorization-job.ts

import { selectModel } from './router';
import { categorizationOutputSchema } from './schemas';

interface CategorizationJob {
  resourceId: string;
  title: string;
  url: string;
  description?: string;
  existingTags?: string[];
}

interface CategorizationResult {
  category: string;
  tags: string[];
  resourceType: string;
  summary: string;
  topics: string[];
  confidence: number;
}

export async function processCategorizationJob(
  job: CategorizationJob
): Promise<CategorizationResult> {
  // Select model per policy
  const modelConfig = selectModel('reasoning', {
    timeout: 15000,
    retries: 2
  });

  // Build prompt
  const prompt = buildCategorizationPrompt(job);

  // Call AI with validation
  const response = await callAI({
    ...modelConfig,
    prompt,
    outputSchema: categorizationOutputSchema
  });

  // Log cost + metrics
  await logAIMetrics({
    resourceId: job.resourceId,
    jobType: 'categorization',
    ...response.metrics
  });

  return response.data;
}

function buildCategorizationPrompt(job: CategorizationJob): string {
  return `You are categorizing a knowledge base resource.

Resource:
- Title: ${job.title}
- URL: ${job.url}
- Description: ${job.description || 'N/A'}
- Existing Tags: ${job.existingTags?.join(', ') || 'N/A'}

Available Categories:
- openclaw: OpenClaw framework, skills, memory, tooling
- development: Development tools, libraries, frameworks
- ai-ml: AI models, ML tools, LLM resources
- documentation: Guides, tutorials, reference docs
- infrastructure: DevOps, hosting, deployment
- design: UI/UX, design systems, tools
- productivity: Tools for personal/work efficiency
- learning: Courses, books, educational content

Resource Types:
- documentation, repository, article, video, tool, skill, memory, guide, other

Return a JSON object with:
- category: one of the available categories (slug)
- tags: 3-7 relevant tags (lowercase, hyphenated)
- resourceType: one of the resource types
- summary: 1-2 sentence summary
- topics: 3-5 key topics (keywords)
- confidence: 0.0-1.0 confidence score

Be precise. If uncertain, lower confidence and use broader categories.`;
}
```

### Output Validation Schema

```typescript
// packages/ai/src/schemas/categorization.ts

import { z } from 'zod';

export const categorizationOutputSchema = z.object({
  category: z.enum([
    'openclaw',
    'development',
    'ai-ml',
    'documentation',
    'infrastructure',
    'design',
    'productivity',
    'learning'
  ]),
  tags: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1).max(10),
  resourceType: z.enum([
    'documentation',
    'repository',
    'article',
    'video',
    'tool',
    'skill',
    'memory',
    'guide',
    'other'
  ]),
  summary: z.string().max(500),
  topics: z.array(z.string()).min(1).max(10),
  confidence: z.number().min(0).max(1)
});
```

### Batch Processing with Rate Limits

```typescript
// apps/web/app/api/ai/process-queue/route.ts

import { processCategorizationJob } from '@repo/ai';
import { createClient } from '@repo/database';

const DAILY_BUDGET = 5.00; // $5/day
const COST_PER_RESOURCE_ESTIMATE = 0.005; // $0.005/resource
const MAX_CONCURRENT = 5;

export async function POST() {
  const supabase = createClient();

  // Check daily budget
  const todayCost = await getTodayAICost();
  if (todayCost >= DAILY_BUDGET) {
    return Response.json({
      error: 'Daily AI budget exceeded',
      spent: todayCost,
      budget: DAILY_BUDGET
    }, { status: 429 });
  }

  // Get pending resources
  const { data: pending } = await supabase
    .from('resources')
    .select('id, title, url, description, raw_data')
    .eq('status', 'pending')
    .limit(100);

  if (!pending || pending.length === 0) {
    return Response.json({ processed: 0 });
  }

  // Process in batches
  const results = await processInBatches(pending, MAX_CONCURRENT);

  return Response.json({
    processed: results.length,
    successes: results.filter(r => r.success).length,
    failures: results.filter(r => !r.success).length
  });
}

async function processInBatches(
  resources: Array<any>,
  concurrency: number
) {
  const results: Array<{ resourceId: string; success: boolean }> = [];

  for (let i = 0; i < resources.length; i += concurrency) {
    const batch = resources.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map(r => processAndSave(r))
    );

    results.push(
      ...batch.map((r, idx) => ({
        resourceId: r.id,
        success: batchResults[idx].status === 'fulfilled'
      }))
    );
  }

  return results;
}

async function processAndSave(resource: any) {
  const result = await processCategorizationJob({
    resourceId: resource.id,
    title: resource.title,
    url: resource.url,
    description: resource.description
  });

  // Update resource with AI results
  await supabase
    .from('resources')
    .update({
      category_id: result.category, // Will need to resolve slug to ID
      resource_type: result.resourceType,
      ai_summary: result.summary,
      ai_topics: result.topics,
      ai_confidence: result.confidence,
      ai_model_used: 'qwen3.5-plus', // Per policy
      status: 'review'
    })
    .eq('id', resource.id);

  // Create/update tags
  for (const tagName of result.tags) {
    await upsertTag(tagName);
    await linkResourceTag(resource.id, tagName, 'ai');
  }
}
```

---

## 4. Progress Tracking

### Real-time Job Status

```typescript
// apps/web/app/api/ingestion/jobs/[jobId]/route.ts

export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  const { data: job } = await supabase
    .from('ingestion_jobs')
    .select('*, resources(count)')
    .eq('id', params.jobId)
    .single();

  const pending = await supabase
    .from('resources')
    .select('id', { count: 'exact', head: true })
    .eq('source', job.source_type)
    .eq('status', 'pending');

  const processing = await supabase
    .from('resources')
    .select('id', { count: 'exact', head: true })
    .eq('source', job.source_type)
    .eq('status', 'processing');

  const review = await supabase
    .from('resources')
    .select('id', { count: 'exact', head: true })
    .eq('source', job.source_type)
    .eq('status', 'review');

  return Response.json({
    ...job,
    progress: {
      total: job.total_count,
      pending: pending.count,
      processing: processing.count,
      review: review.count,
      completed: job.processed_count,
      failed: job.failed_count,
      percentComplete: Math.round((job.processed_count / job.total_count) * 100)
    }
  });
}
```

---

## Error Handling

| Error Type | Handling |
|------------|----------|
| Invalid CSV/JSON | Return parse errors with row numbers, reject upload |
| Duplicate URLs | Skip duplicates, report in summary |
| AI Timeout | Retry (max 2), then mark for manual review |
| AI Validation Fail | Mark for manual review, log raw response |
| Budget Exceeded | Pause queue, notify admin |
| Database Error | Rollback batch, retry with backoff |

---

**Pipeline Version:** 1.0
**Status:** Ready for implementation
**Next:** Build ingestion UI + API routes
