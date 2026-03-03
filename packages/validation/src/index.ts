/**
 * Validation Package
 * 
 * Shared Zod schemas for Knowledge Graph Studio
 */

export { z } from 'zod';

/**
 * URL validation schema
 */
export const urlSchema = z.string().url('Invalid URL');

/**
 * Slug validation schema (lowercase, hyphenated)
 */
export const slugSchema = z
  .string()
  .min(1, 'Slug required')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug must be lowercase, hyphenated, alphanumeric'
  );

/**
 * Resource ID schema (UUID)
 */
export const resourceIdSchema = z.string().uuid('Invalid resource ID');

/**
 * Pagination schema
 */
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
});

/**
 * Search query schema
 */
export const searchQuerySchema = z.object({
  q: z.string().min(1).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  resourceType: z.string().optional(),
  status: z.enum(['pending', 'processing', 'review', 'approved', 'rejected', 'archived']).optional(),
  sortBy: z.enum(['created_at', 'updated_at', 'title', 'ai_confidence']).default('updated_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
