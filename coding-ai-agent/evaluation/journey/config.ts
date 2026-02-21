/**
 * Configuration for Journey Evaluation
 * End-to-end multi-turn conversation evaluation
 */

export const JOURNEY_EVAL_CONFIG = {
  // LLM Judge for quality evaluation
  JUDGE_MODEL: 'gpt-5.2',
  JUDGE_TEMPERATURE: 0.1,
  
  // Evaluation thresholds
  QUALITY_PASS_THRESHOLD: 2, // Score 0-3, need 2+ to pass
  SATISFACTION_PASS: 'like', // User satisfaction: 'like' or 'unlike'
  
  // Rate limiting
  RATE_LIMIT_DELAY_MS: 1000,
  
  // Cost estimation (USD per 1M tokens)
  TOKEN_COSTS: {
    'gpt-5.2': {
      input: 1.75,
      output: 14.00,
    },
    'gpt-4o': {
      input: 2.5,
      output: 10.00,
    },
    'gpt-4o-mini': {
      input: 0.150,
      output: 0.600,
    },
    'text-embedding-3-small': {
      input: 0.020,
      output: 0,
    },
  } as Record<string, { input: number; output: number }>,
} as const;
