/**
 * AI Package Entry Point
 * 
 * Exports:
 * - Model router (per policy)
 * - Schemas (validation)
 * - Categorization job processor
 */

export {
  selectModel,
  estimateCost,
  validateOutput,
  MODEL_COSTS,
  type TaskType,
  type ModelConfig,
  type ModelOptions
} from './router';

export {
  categorizationOutputSchema,
  normalizeCategorization,
  categorizationFallback,
  CATEGORY_SLUGS,
  RESOURCE_TYPES,
  type CategorizationOutput,
  type CategorySlug,
  type ResourceType
} from './schemas/categorization';
