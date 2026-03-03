/**
 * AI Model Router
 * 
 * Implements Model Selection Policy (DOCUMENTATION.md §6)
 * 
 * Task Type → Model Mapping:
 * - reasoning/long-context → qwen3.5-plus
 * - code-generation → MiniMax-M2.5
 * - agentic/planning → kimi-k2.5
 * - high-accuracy → qwen3.5-plus
 * - cost-sensitive → qwen3-max-2026-01-23
 * - short-prompt → glm-4.7
 */

export type TaskType =
  | 'reasoning'
  | 'long-context'
  | 'summarization'
  | 'code-generation'
  | 'refactoring'
  | 'programming'
  | 'agentic'
  | 'planning'
  | 'tool-integration'
  | 'high-accuracy'
  | 'cost-sensitive'
  | 'short-prompt';

export interface ModelConfig {
  model: string;
  provider: 'openai' | 'claude' | 'qwen' | 'minimax' | 'kimi' | 'glm';
  fallback?: string;
  timeout?: number;
  retries?: number;
  maxTokens?: number;
  temperature?: number;
}

export interface ModelOptions {
  timeout?: number;
  retries?: number;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Model cost tracking (approximate, per 1K tokens)
 * Update quarterly with actual pricing
 */
export const MODEL_COSTS: Record<string, number> = {
  'qwen3.5-plus': 0.005,
  'MiniMax-M2.5': 0.003,
  'kimi-k2.5': 0.004,
  'qwen3-max-2026-01-23': 0.001,
  'glm-4.7': 0.0005,
  'glm-5': 0.0008,
  'qwen3-coder-next': 0.002,
  'qwen3-coder-plus': 0.003
};

/**
 * Select model based on task type per policy
 */
export function selectModel(
  taskType: TaskType,
  options: ModelOptions = {}
): ModelConfig {
  const baseConfig = {
    timeout: options.timeout ?? 15000,
    retries: options.retries ?? 2,
    maxTokens: options.maxTokens,
    temperature: options.temperature
  };

  switch (taskType) {
    // Reasoning & Long Context
    case 'reasoning':
    case 'long-context':
    case 'summarization':
      return {
        model: 'qwen3.5-plus',
        provider: 'qwen',
        ...baseConfig
      };

    // Code Generation
    case 'code-generation':
    case 'refactoring':
    case 'programming':
      return {
        model: 'MiniMax-M2.5',
        provider: 'minimax',
        fallback: 'glm-5',
        ...baseConfig
      };

    // Agentic Workflows
    case 'agentic':
    case 'planning':
    case 'tool-integration':
      return {
        model: 'kimi-k2.5',
        provider: 'kimi',
        ...baseConfig
      };

    // High Accuracy
    case 'high-accuracy':
      return {
        model: 'qwen3.5-plus',
        provider: 'qwen',
        ...baseConfig
      };

    // Cost-Sensitive
    case 'cost-sensitive':
      return {
        model: 'qwen3-max-2026-01-23',
        provider: 'qwen',
        ...baseConfig
      };

    // Short Prompts
    case 'short-prompt':
      return {
        model: 'glm-4.7',
        provider: 'glm',
        ...baseConfig
      };

    // Default fallback
    default:
      return {
        model: 'qwen3.5-plus',
        provider: 'qwen',
        ...baseConfig
      };
  }
}

/**
 * Get estimated cost for a task
 */
export function estimateCost(
  taskType: TaskType,
  estimatedTokens: number
): number {
  const config = selectModel(taskType);
  const costPerToken = MODEL_COSTS[config.model] ?? 0.005;
  return (estimatedTokens / 1000) * costPerToken;
}

/**
 * Validate model output against schema
 * Returns parsed data or throws validation error
 */
export function validateOutput<T>(
  schema: { parse: (data: unknown) => T },
  data: unknown,
  fallback?: T
): { success: true; data: T } | { success: false; error: string; data?: T } {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (fallback !== undefined) {
      return { success: false, error: 'Validation failed', data: fallback };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown validation error'
    };
  }
}
