/**
 * Prompt Evaluation Configuration
 * Centralized configuration for LLM judge evaluation
 */

export const PROMPT_EVAL_CONFIG = {
  /**
   * LLM Judge Model
   * Model used for judging the quality of responses
   */
  JUDGE_MODEL: 'gpt-5.2',

  /**
   * Temperature for judge
   * Lower temperature for more consistent judgments
   */
  JUDGE_TEMPERATURE: 0.1,

  /**
   * Delay between test case evaluations (ms)
   * Prevents OpenAI API rate limiting
   */
  RATE_LIMIT_DELAY_MS: 500,

  /**
   * Scoring thresholds
   * 0-1: Bad (fail)
   * 2-3: Good (pass)
   */
  PASS_THRESHOLD: 2,
} as const;
