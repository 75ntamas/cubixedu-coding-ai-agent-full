/**
 * RAG Evaluation Configuration
 * Centralized configuration for RAG evaluation settings
 */

export const RAG_EVAL_CONFIG = {
  /**
   * K - Number of top results to evaluate
   * Common benchmark values: @1, @5, @10, @20
   * Can be any positive integer
   */
  K: 3,

  /**
   * Delay between test case evaluations (ms)
   * Prevents OpenAI API rate limiting during embedding generation
   * Each test case requires an OpenAI embedding API call to convert query to vector
   */
  RATE_LIMIT_DELAY_MS: 500,
} as const;
