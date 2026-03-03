/**
 * AI Categorization Output Schema
 * 
 * Validates AI output for resource categorization
 * Used with RouteLLM abstraction
 */

import { z } from 'zod';

/**
 * Controlled categories (must match database slugs)
 */
export const CATEGORY_SLUGS = [
  'openclaw',
  'development',
  'ai-ml',
  'documentation',
  'infrastructure',
  'design',
  'productivity',
  'learning'
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

/**
 * Controlled resource types (must match database enum)
 */
export const RESOURCE_TYPES = [
  'documentation',
  'repository',
  'article',
  'video',
  'tool',
  'skill',
  'memory',
  'guide',
  'other'
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];

/**
 * Categorization output schema
 * 
 * All fields required except confidence (defaults to 0.5)
 */
export const categorizationOutputSchema = z.object({
  /**
   * Category slug (must be one of CATEGORY_SLUGS)
   * If AI returns unknown category, mark needs_review
   */
  category: z.enum(CATEGORY_SLUGS),

  /**
   * Tags: 3-7 relevant tags
   * Lowercase, hyphenated, alphanumeric only
   */
  tags: z
    .array(z.string().regex(/^[a-z0-9-]+$/, 'Tag must be lowercase, hyphenated'))
    .min(1, 'At least 1 tag required')
    .max(10, 'Maximum 10 tags'),

  /**
   * Resource type (must be one of RESOURCE_TYPES)
   * If AI returns unknown type, default to 'other'
   */
  resourceType: z.enum(RESOURCE_TYPES),

  /**
   * Summary: 1-2 sentences, max 500 characters
   */
  summary: z.string().min(10).max(500),

  /**
   * Key topics: 3-5 keywords
   */
  topics: z
    .array(z.string())
    .min(1, 'At least 1 topic required')
    .max(10, 'Maximum 10 topics'),

  /**
   * Confidence score: 0.0-1.0
   * Below 0.70 → needs_review
   */
  confidence: z.number().min(0).max(1).default(0.5)
});

export type CategorizationOutput = z.infer<typeof categorizationOutputSchema>;

/**
 * Fallback output for when AI fails or returns invalid data
 */
export const categorizationFallback: CategorizationOutput = {
  category: 'other' as CategorySlug,
  tags: ['uncategorized'],
  resourceType: 'other',
  summary: 'AI categorization failed. Manual review required.',
  topics: ['review-needed'],
  confidence: 0.0
};

/**
 * Validate and normalize categorization output
 * 
 * - Unknown categories → 'other' + needs_review
 * - Unknown types → 'other'
 * - Low confidence → needs_review
 * - Invalid tags → filter out
 */
export function normalizeCategorization(
  data: unknown
): {
  valid: CategorizationOutput;
  needsReview: boolean;
  reviewReasons: string[];
} {
  const reviewReasons: string[] = [];
  
  // Try to parse
  const result = categorizationOutputSchema.safeParse(data);
  
  if (!result.success) {
    // Return fallback + flag for review
    return {
      valid: categorizationFallback,
      needsReview: true,
      reviewReasons: ['AI output validation failed']
    };
  }

  const output = result.data;

  // Check confidence threshold
  if (output.confidence < 0.70) {
    reviewReasons.push(`Low confidence: ${output.confidence.toFixed(2)} < 0.70`);
  }

  return {
    valid: output,
    needsReview: reviewReasons.length > 0,
    reviewReasons
  };
}
