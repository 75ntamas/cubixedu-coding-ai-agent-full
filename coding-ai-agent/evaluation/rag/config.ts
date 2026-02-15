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
   * Minimum similarity score threshold (0-1)
   * Filters out results below this score to reduce noise
   * - 0.0 = Accept all results (no filtering)
   * - 0.7 = Moderate filtering (recommended for most cases)
   * - 0.85 = Strict filtering (high precision, may miss some relevant results)
   */
  MIN_SIMILARITY_SCORE: 0.68,

  /**
   * Delay between test case evaluations (ms)
   * Prevents OpenAI API rate limiting during embedding generation
   * Each test case requires an OpenAI embedding API call to convert query to vector
   */
  RATE_LIMIT_DELAY_MS: 500,
} as const;
