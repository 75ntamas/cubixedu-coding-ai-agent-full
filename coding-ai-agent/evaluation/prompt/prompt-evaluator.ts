/**
 * Prompt Evaluator with LLM Judge
 * Evaluates LLM responses using three metrics:
 * 1. Answer Relevance - Does the answer address the question?
 * 2. Answer Correctness - Is the answer factually correct?
 * 3. Groundedness - Is the answer based on the provided context?
 */

import OpenAI from 'openai';
import { PromptTestCase } from './test-dataset';
import { PROMPT_EVAL_CONFIG } from './config';
import { appConfig } from '@/app.config';

export interface JudgmentScores {
  relevance: number;      // 0-3: How relevant is the answer to the question?
  correctness: number;    // 0-3: Is the answer factually correct?
  groundedness: number;   // 0-3: Is the answer based on the context (no hallucination)?
}

export interface PromptTestResult {
  testId: string;
  question: string;
  context: string;
  actualAnswer: string;
  expectedAnswer: string;
  difficulty: string;
  scores: JudgmentScores;
  judgmentReasons: {
    relevance: string;
    correctness: string;
    groundedness: string;
  };
  passed: boolean;
}

export interface AggregatedPromptMetrics {
  avgRelevance: number;
  avgCorrectness: number;
  avgGroundedness: number;
  passRate: number;
  byDifficulty: {
    easy: { avgRelevance: number; avgCorrectness: number; avgGroundedness: number; passRate: number };
    medium: { avgRelevance: number; avgCorrectness: number; avgGroundedness: number; passRate: number };
    hard: { avgRelevance: number; avgCorrectness: number; avgGroundedness: number; passRate: number };
  };
}

export interface PromptEvaluationResults {
  individualResults: PromptTestResult[];
  aggregatedMetrics: AggregatedPromptMetrics;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  timestamp: string;
  config: {
    judgeModel: string;
    judgeTemperature: number;
    passThreshold: number;
  };
}

export class PromptEvaluator {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Generate answer using the LLM
   */
  private async generateAnswer(question: string, context: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: appConfig.openai.chatModel,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful coding assistant. Answer questions based on the provided code context. Be concise and accurate.',
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion: ${question}`,
        },
      ],
      temperature: 0.3,
    });

    return response.choices[0].message.content || '';
  }

  /**
   * Judge answer relevance using LLM
   * Measures if the answer addresses the question topic
   */
  private async judgeRelevance(
    question: string,
    answer: string
  ): Promise<{ score: number; reason: string }> {
    const prompt = `You are evaluating the RELEVANCE of an answer to a question.

Relevance means: Does the answer address the topic of the question? It doesn't need to be correct, just on-topic.

Scoring:
0 = Completely off-topic or no answer
1 = Tangentially related but misses the main point
2 = Addresses the question topic adequately
3 = Directly and fully addresses the question topic

Question: ${question}

Answer: ${answer}

Provide your evaluation in this exact JSON format:
{
  "score": <number 0-3>,
  "reason": "<brief explanation>"
}`;

    const response = await this.openai.chat.completions.create({
      model: PROMPT_EVAL_CONFIG.JUDGE_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: PROMPT_EVAL_CONFIG.JUDGE_TEMPERATURE,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"score": 0, "reason": "Failed to parse"}');
    return { score: result.score, reason: result.reason };
  }

  /**
   * Judge answer correctness using LLM
   * Measures if the answer is factually accurate
   */
  private async judgeCorrectness(
    question: string,
    answer: string,
    expectedAnswer: string,
    context: string
  ): Promise<{ score: number; reason: string }> {
    const prompt = `You are evaluating the CORRECTNESS of an answer.

Correctness means: Is the answer factually accurate? Compare it to the expected answer and context.

Scoring:
0 = Completely incorrect or contradicts the facts
1 = Partially correct but has significant errors
2 = Mostly correct with minor inaccuracies
3 = Fully correct and accurate

Question: ${question}

Context: ${context}

Expected Answer: ${expectedAnswer}

Actual Answer: ${answer}

Provide your evaluation in this exact JSON format:
{
  "score": <number 0-3>,
  "reason": "<brief explanation>"
}`;

    const response = await this.openai.chat.completions.create({
      model: PROMPT_EVAL_CONFIG.JUDGE_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: PROMPT_EVAL_CONFIG.JUDGE_TEMPERATURE,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"score": 0, "reason": "Failed to parse"}');
    return { score: result.score, reason: result.reason };
  }

  /**
   * Judge answer groundedness using LLM
   * Measures if the answer is based on the context (no hallucination)
   */
  private async judgeGroundedness(
    answer: string,
    context: string
  ): Promise<{ score: number; reason: string }> {
    const prompt = `You are evaluating the GROUNDEDNESS of an answer.

Groundedness means: Is the answer based on the provided context? Does it contain hallucinated or made-up information?

Scoring:
0 = Completely made up, no connection to context
1 = Some grounding but includes significant hallucinations
2 = Mostly grounded with minor unsupported details
3 = Fully grounded, all claims supported by context

Context: ${context}

Answer: ${answer}

Provide your evaluation in this exact JSON format:
{
  "score": <number 0-3>,
  "reason": "<brief explanation>"
}`;

    const response = await this.openai.chat.completions.create({
      model: PROMPT_EVAL_CONFIG.JUDGE_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: PROMPT_EVAL_CONFIG.JUDGE_TEMPERATURE,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"score": 0, "reason": "Failed to parse"}');
    return { score: result.score, reason: result.reason };
  }

  /**
   * Evaluate a single test case
   */
  async evaluateTestCase(testCase: PromptTestCase): Promise<PromptTestResult> {
    // 1. Generate answer from LLM
    const actualAnswer = await this.generateAnswer(testCase.question, testCase.context);

    // 2. Judge the answer on three metrics
    const relevanceJudgment = await this.judgeRelevance(testCase.question, actualAnswer);
    const correctnessJudgment = await this.judgeCorrectness(
      testCase.question,
      actualAnswer,
      testCase.expectedAnswer,
      testCase.context
    );
    const groundednessJudgment = await this.judgeGroundedness(actualAnswer, testCase.context);

    // 3. Calculate if test passed (all scores >= 2)
    const passed =
      relevanceJudgment.score >= PROMPT_EVAL_CONFIG.PASS_THRESHOLD &&
      correctnessJudgment.score >= PROMPT_EVAL_CONFIG.PASS_THRESHOLD &&
      groundednessJudgment.score >= PROMPT_EVAL_CONFIG.PASS_THRESHOLD;

    return {
      testId: testCase.id,
      question: testCase.question,
      context: testCase.context,
      actualAnswer,
      expectedAnswer: testCase.expectedAnswer,
      difficulty: testCase.difficulty,
      scores: {
        relevance: relevanceJudgment.score,
        correctness: correctnessJudgment.score,
        groundedness: groundednessJudgment.score,
      },
      judgmentReasons: {
        relevance: relevanceJudgment.reason,
        correctness: correctnessJudgment.reason,
        groundedness: groundednessJudgment.reason,
      },
      passed,
    };
  }

  /**
   * Evaluate entire dataset
   */
  async evaluateDataset(
    testCases: PromptTestCase[],
    progressCallback?: (progress: number, testId: string) => void
  ): Promise<PromptEvaluationResults> {
    const results: PromptTestResult[] = [];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];

      try {
        const result = await this.evaluateTestCase(testCase);
        results.push(result);

        if (progressCallback) {
          progressCallback(((i + 1) / testCases.length) * 100, testCase.id);
        }

        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, PROMPT_EVAL_CONFIG.RATE_LIMIT_DELAY_MS));
      } catch (error) {
        console.error(`Error evaluating ${testCase.id}:`, error);
        // Add failed result with zeros
        results.push({
          testId: testCase.id,
          question: testCase.question,
          context: testCase.context,
          actualAnswer: 'ERROR: Failed to generate answer',
          expectedAnswer: testCase.expectedAnswer,
          difficulty: testCase.difficulty,
          scores: { relevance: 0, correctness: 0, groundedness: 0 },
          judgmentReasons: {
            relevance: 'Error during evaluation',
            correctness: 'Error during evaluation',
            groundedness: 'Error during evaluation',
          },
          passed: false,
        });
      }
    }

    // Calculate aggregated metrics
    const passedTests = results.filter(r => r.passed).length;
    const aggregated = this.calculateAggregatedMetrics(results);

    return {
      individualResults: results,
      aggregatedMetrics: aggregated,
      totalTests: results.length,
      passedTests,
      failedTests: results.length - passedTests,
      timestamp: new Date().toISOString(),
      config: {
        judgeModel: PROMPT_EVAL_CONFIG.JUDGE_MODEL,
        judgeTemperature: PROMPT_EVAL_CONFIG.JUDGE_TEMPERATURE,
        passThreshold: PROMPT_EVAL_CONFIG.PASS_THRESHOLD,
      },
    };
  }

  /**
   * Calculate aggregated metrics
   */
  private calculateAggregatedMetrics(results: PromptTestResult[]): AggregatedPromptMetrics {
    const calcMetrics = (testResults: PromptTestResult[]) => {
      if (testResults.length === 0) {
        return { avgRelevance: 0, avgCorrectness: 0, avgGroundedness: 0, passRate: 0 };
      }

      return {
        avgRelevance: testResults.reduce((sum, r) => sum + r.scores.relevance, 0) / testResults.length,
        avgCorrectness: testResults.reduce((sum, r) => sum + r.scores.correctness, 0) / testResults.length,
        avgGroundedness: testResults.reduce((sum, r) => sum + r.scores.groundedness, 0) / testResults.length,
        passRate: testResults.filter(r => r.passed).length / testResults.length,
      };
    };

    return {
      avgRelevance: results.reduce((sum, r) => sum + r.scores.relevance, 0) / results.length,
      avgCorrectness: results.reduce((sum, r) => sum + r.scores.correctness, 0) / results.length,
      avgGroundedness: results.reduce((sum, r) => sum + r.scores.groundedness, 0) / results.length,
      passRate: results.filter(r => r.passed).length / results.length,
      byDifficulty: {
        easy: calcMetrics(results.filter(r => r.difficulty === 'easy')),
        medium: calcMetrics(results.filter(r => r.difficulty === 'medium')),
        hard: calcMetrics(results.filter(r => r.difficulty === 'hard')),
      },
    };
  }
}
