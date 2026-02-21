/**
 * Journey Evaluator
 * End-to-end multi-turn conversation evaluation with performance monitoring
 * 
 * Features:
 * - Multi-turn conversation testing
 * - Response quality evaluation (LLM Judge)
 * - User satisfaction simulation (LLM)
 * - Performance monitoring (TTFT, TTLT, e2e_latency)
 * - Token usage and cost tracking
 */

import OpenAI from 'openai';
import { JourneyTestCase } from './test-dataset';
import { JOURNEY_EVAL_CONFIG } from './config';
import { appConfig } from '@/app.config';

// ========== Types ==========

export interface PerformanceMetrics {
  ttft: number; // Time to First Token (ms)
  ttlt: number; // Time to Last Token (ms) - same as e2e_latency
  e2e_latency: number; // End-to-End Request Latency (ms)
  tokens_per_second: number; // Throughput
}

export interface TokenUsage {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
}

export interface CostMetrics {
  input_cost: number; // USD
  output_cost: number; // USD
  total_cost: number; // USD
}

export interface TurnResult {
  turn_number: number;
  role: 'user' | 'assistant';
  content: string;
  performance?: PerformanceMetrics;
  token_usage?: TokenUsage;
  cost?: CostMetrics;
}

export interface QualityScores {
  relevance: number; // 0-3: Is response relevant to the question?
  accuracy: number; // 0-3: Is response accurate based on code knowledge?
  completeness: number; // 0-3: Does response fully address the question?
  clarity: number; // 0-3: Is response clear and well-explained?
}

export interface SatisfactionScore {
  liked: boolean; // User satisfaction: true = like, false = unlike
  reasoning: string;
}

export interface JourneyTestResult {
  testId: string;
  name: string;
  difficulty: string;
  conversation: TurnResult[];
  
  // Quality evaluation (LLM Judge)
  qualityScores: QualityScores;
  qualityReasoning: string;
  
  // User satisfaction (LLM simulation)
  satisfactionScore: SatisfactionScore;
  
  // Aggregated metrics
  totalPerformance: {
    avg_ttft: number;
    avg_ttlt: number;
    avg_e2e_latency: number;
    total_duration: number; // Sum of all e2e latencies
  };
  totalTokenUsage: TokenUsage;
  totalCost: CostMetrics;
  
  // Pass/fail
  qualityPassed: boolean;
  satisfactionPassed: boolean;
  overallPassed: boolean;
  
  // Model information
  answerModel: string; // Model that generated answers
  judgeModel: string; // Model that judged quality and satisfaction
}

export interface AggregatedJourneyMetrics {
  avgQualityScores: QualityScores;
  likeRate: number; // Percentage of liked conversations
  avgPerformance: {
    avg_ttft: number;
    avg_ttlt: number;
    avg_e2e_latency: number;
  };
  totalTokenUsage: TokenUsage;
  totalCost: CostMetrics;
  passRate: number;
  byDifficulty: {
    easy: { avgQuality: number; likeRate: number; passRate: number };
    medium: { avgQuality: number; likeRate: number; passRate: number };
    hard: { avgQuality: number; likeRate: number; passRate: number };
  };
}

export interface JourneyEvaluationResults {
  individualResults: JourneyTestResult[];
  aggregatedMetrics: AggregatedJourneyMetrics;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  timestamp: string;
  config: {
    answerModel: string;
    judgeModel: string;
    qualityThreshold: number;
    satisfactionType: string; // 'like' or 'unlike'
  };
}

// ========== Evaluator Class ==========

export class JourneyEvaluator {
  private openai: OpenAI;
  private chatApiUrl: string;

  constructor(chatApiUrl: string = 'http://localhost:3000/api/chat') {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.chatApiUrl = chatApiUrl;
  }

  /**
   * Execute a single conversation turn with performance monitoring
   */
  private async executeTurn(
    messages: any[],
    isUserTurn: boolean
  ): Promise<{ content: string; performance: PerformanceMetrics; tokenUsage: TokenUsage }> {
    if (isUserTurn) {
      // User turns don't have performance metrics
      const userContent = messages[messages.length - 1].content;
      return {
        content: userContent,
        performance: { ttft: 0, ttlt: 0, e2e_latency: 0, tokens_per_second: 0 },
        tokenUsage: { input_tokens: 0, output_tokens: 0, total_tokens: 0 },
      };
    }

    // Assistant turn - call the chat API with monitoring
    const startTime = performance.now();
    let firstTokenTime: number | null = null;
    let lastTokenTime: number | null = null;
    let fullResponse = '';
    let tokenCount = 0;

    try {
      const response = await fetch(this.chatApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response stream');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                if (firstTokenTime === null) {
                  firstTokenTime = performance.now();
                }
                fullResponse += parsed.content;
                tokenCount++;
                lastTokenTime = performance.now();
              }
            } catch (e) {
              // Skip unparseable lines
            }
          }
        }
      }

      const endTime = performance.now();
      const ttft = firstTokenTime ? firstTokenTime - startTime : 0;
      const ttlt = lastTokenTime ? lastTokenTime - startTime : 0;
      const e2e_latency = endTime - startTime;
      const tokens_per_second = ttlt > 0 ? (tokenCount / ttlt) * 1000 : 0;

      // Estimate token usage (rough approximation: ~4 chars per token)
      const inputText = messages.map((m: any) => m.content).join(' ');
      const estimatedInputTokens = Math.ceil(inputText.length / 4);
      const estimatedOutputTokens = Math.ceil(fullResponse.length / 4);

      return {
        content: fullResponse,
        performance: { ttft, ttlt, e2e_latency, tokens_per_second },
        tokenUsage: {
          input_tokens: estimatedInputTokens,
          output_tokens: estimatedOutputTokens,
          total_tokens: estimatedInputTokens + estimatedOutputTokens,
        },
      };
    } catch (error) {
      console.error('Error executing turn:', error);
      throw error;
    }
  }

  /**
   * Calculate cost based on token usage and model
   */
  private calculateCost(tokenUsage: TokenUsage, model: string): CostMetrics {
    const costs = JOURNEY_EVAL_CONFIG.TOKEN_COSTS[model] || { input: 0, output: 0 };
    
    const input_cost = (tokenUsage.input_tokens / 1_000_000) * costs.input;
    const output_cost = (tokenUsage.output_tokens / 1_000_000) * costs.output;
    const total_cost = input_cost + output_cost;

    return { input_cost, output_cost, total_cost };
  }

  /**
   * Evaluate response quality using LLM Judge
   */
  private async evaluateQuality(
    conversation: TurnResult[],
    expectedOutcomes: any
  ): Promise<{ scores: QualityScores; reasoning: string }> {
    const conversationText = conversation
      .map((turn) => `${turn.role.toUpperCase()}: ${turn.content}`)
      .join('\n\n');

    const prompt = `You are evaluating the QUALITY of an AI assistant's responses in a multi-turn conversation.

Conversation:
${conversationText}

Expected Outcomes:
- Goals: ${expectedOutcomes.goals.join(', ')}
- Key Points: ${expectedOutcomes.keyPoints.join(', ')}

Evaluate the assistant's responses on these metrics (0-3 scale each):

1. RELEVANCE: Are responses relevant to user questions?
   0 = Off-topic, 1 = Somewhat relevant, 2 = Mostly relevant, 3 = Highly relevant

2. ACCURACY: Are responses factually accurate based on code knowledge?
   0 = Inaccurate, 1 = Partially accurate, 2 = Mostly accurate, 3 = Fully accurate

3. COMPLETENESS: Do responses fully address questions and expected outcomes?
   0 = Incomplete, 1 = Partially complete, 2 = Mostly complete, 3 = Fully complete

4. CLARITY: Are responses clear and well-explained?
   0 = Unclear, 1 = Somewhat clear, 2 = Mostly clear, 3 = Very clear

Provide your evaluation in this exact JSON format:
{
  "relevance": <0-3>,
  "accuracy": <0-3>,
  "completeness": <0-3>,
  "clarity": <0-3>,
  "reasoning": "<brief explanation of scores>"
}`;

    const response = await this.openai.chat.completions.create({
      model: JOURNEY_EVAL_CONFIG.JUDGE_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: JOURNEY_EVAL_CONFIG.JUDGE_TEMPERATURE,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      scores: {
        relevance: result.relevance || 0,
        accuracy: result.accuracy || 0,
        completeness: result.completeness || 0,
        clarity: result.clarity || 0,
      },
      reasoning: result.reasoning || 'No reasoning provided',
    };
  }

  /**
   * Simulate user satisfaction using LLM
   */
  private async simulateUserSatisfaction(
    conversation: TurnResult[],
    expectedOutcomes: any
  ): Promise<SatisfactionScore> {
    const conversationText = conversation
      .map((turn) => `${turn.role.toUpperCase()}: ${turn.content}`)
      .join('\n\n');

    const prompt = `You are simulating a USER's satisfaction after having a conversation with an AI coding assistant.

Conversation:
${conversationText}

User's Original Goals:
${expectedOutcomes.goals.join('\n')}

As a user, would you LIKE or UNLIKE this conversation?

Consider:
- Did the assistant understand my questions?
- Did I get the information I needed?
- Were the explanations clear and useful?
- Was the conversation efficient and helpful?

LIKE if: The conversation was helpful, informative, and met your needs
UNLIKE if: The conversation was confusing, unhelpful, or wasted your time

Provide your evaluation in this exact JSON format:
{
  "liked": <true or false>,
  "reasoning": "<brief explanation as a user>"
}`;

    const response = await this.openai.chat.completions.create({
      model: JOURNEY_EVAL_CONFIG.JUDGE_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: JOURNEY_EVAL_CONFIG.JUDGE_TEMPERATURE,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      liked: result.liked || false,
      reasoning: result.reasoning || 'No reasoning provided',
    };
  }

  /**
   * Evaluate a single journey test case
   */
  async evaluateJourney(testCase: JourneyTestCase): Promise<JourneyTestResult> {
    const conversationResults: TurnResult[] = [];
    const messages: any[] = [];

    // Execute conversation turn by turn
    for (let i = 0; i < testCase.conversation.length; i++) {
      const turn = testCase.conversation[i];
      const isUserTurn = turn.role === 'user';

      messages.push({ role: turn.role, content: turn.content });

      const { content, performance, tokenUsage } = await this.executeTurn(
        messages,
        isUserTurn
      );

      // Update assistant content in messages
      if (!isUserTurn) {
        messages[messages.length - 1].content = content;
      }

      const cost = this.calculateCost(tokenUsage, appConfig.openai.chatModel);

      conversationResults.push({
        turn_number: i + 1,
        role: turn.role,
        content: isUserTurn ? turn.content : content,
        performance: !isUserTurn ? performance : undefined,
        token_usage: tokenUsage,
        cost: cost,
      });

      // Small delay between turns
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Evaluate quality
    const qualityEval = await this.evaluateQuality(
      conversationResults,
      testCase.expectedOutcomes
    );

    // Simulate user satisfaction
    const satisfactionScore = await this.simulateUserSatisfaction(
      conversationResults,
      testCase.expectedOutcomes
    );

    // Calculate aggregated metrics
    const assistantTurns = conversationResults.filter((t) => t.role === 'assistant');
    const totalTokenUsage = conversationResults.reduce(
      (acc, turn) => ({
        input_tokens: acc.input_tokens + (turn.token_usage?.input_tokens || 0),
        output_tokens: acc.output_tokens + (turn.token_usage?.output_tokens || 0),
        total_tokens: acc.total_tokens + (turn.token_usage?.total_tokens || 0),
      }),
      { input_tokens: 0, output_tokens: 0, total_tokens: 0 }
    );

    const totalCost = conversationResults.reduce(
      (acc, turn) => ({
        input_cost: acc.input_cost + (turn.cost?.input_cost || 0),
        output_cost: acc.output_cost + (turn.cost?.output_cost || 0),
        total_cost: acc.total_cost + (turn.cost?.total_cost || 0),
      }),
      { input_cost: 0, output_cost: 0, total_cost: 0 }
    );

    const totalPerformance = {
      avg_ttft:
        assistantTurns.reduce((sum, t) => sum + (t.performance?.ttft || 0), 0) /
        assistantTurns.length,
      avg_ttlt:
        assistantTurns.reduce((sum, t) => sum + (t.performance?.ttlt || 0), 0) /
        assistantTurns.length,
      avg_e2e_latency:
        assistantTurns.reduce((sum, t) => sum + (t.performance?.e2e_latency || 0), 0) /
        assistantTurns.length,
      total_duration: assistantTurns.reduce(
        (sum, t) => sum + (t.performance?.e2e_latency || 0),
        0
      ),
    };

    // Determine pass/fail
    const avgQualityScore =
      (qualityEval.scores.relevance +
        qualityEval.scores.accuracy +
        qualityEval.scores.completeness +
        qualityEval.scores.clarity) /
      4;

    const qualityPassed = avgQualityScore >= JOURNEY_EVAL_CONFIG.QUALITY_PASS_THRESHOLD;
    const satisfactionPassed = satisfactionScore.liked === true;
    const overallPassed = qualityPassed && satisfactionPassed;

    return {
      testId: testCase.id,
      name: testCase.name,
      difficulty: testCase.difficulty,
      conversation: conversationResults,
      qualityScores: qualityEval.scores,
      qualityReasoning: qualityEval.reasoning,
      satisfactionScore,
      totalPerformance,
      totalTokenUsage,
      totalCost,
      qualityPassed,
      satisfactionPassed,
      overallPassed,
      answerModel: 'gpt-5.2', // Model used by chat API
      judgeModel: JOURNEY_EVAL_CONFIG.JUDGE_MODEL,
    };
  }

  /**
   * Evaluate entire dataset
   */
  async evaluateDataset(
    testCases: JourneyTestCase[],
    progressCallback?: (progress: number, testId: string) => void
  ): Promise<JourneyEvaluationResults> {
    const results: JourneyTestResult[] = [];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];

      try {
        const result = await this.evaluateJourney(testCase);
        results.push(result);

        if (progressCallback) {
          progressCallback(((i + 1) / testCases.length) * 100, testCase.id);
        }

        // Rate limiting
        await new Promise((resolve) =>
          setTimeout(resolve, JOURNEY_EVAL_CONFIG.RATE_LIMIT_DELAY_MS)
        );
      } catch (error) {
        console.error(`Error evaluating ${testCase.id}:`, error);
        // Add failed result
        results.push({
          testId: testCase.id,
          name: testCase.name,
          difficulty: testCase.difficulty,
          conversation: [],
          qualityScores: { relevance: 0, accuracy: 0, completeness: 0, clarity: 0 },
          qualityReasoning: 'Error during evaluation',
          satisfactionScore: { liked: false, reasoning: 'Error during evaluation' },
          totalPerformance: { avg_ttft: 0, avg_ttlt: 0, avg_e2e_latency: 0, total_duration: 0 },
          totalTokenUsage: { input_tokens: 0, output_tokens: 0, total_tokens: 0 },
          totalCost: { input_cost: 0, output_cost: 0, total_cost: 0 },
          qualityPassed: false,
          satisfactionPassed: false,
          overallPassed: false,
          answerModel: 'gpt-5.2',
          judgeModel: JOURNEY_EVAL_CONFIG.JUDGE_MODEL,
        });
      }
    }

    // Calculate aggregated metrics
    const aggregated = this.calculateAggregatedMetrics(results);
    const passedTests = results.filter((r) => r.overallPassed).length;

    return {
      individualResults: results,
      aggregatedMetrics: aggregated,
      totalTests: results.length,
      passedTests,
      failedTests: results.length - passedTests,
      timestamp: new Date().toISOString(),
      config: {
        answerModel: 'gpt-5.2',
        judgeModel: JOURNEY_EVAL_CONFIG.JUDGE_MODEL,
        qualityThreshold: JOURNEY_EVAL_CONFIG.QUALITY_PASS_THRESHOLD,
        satisfactionType: JOURNEY_EVAL_CONFIG.SATISFACTION_PASS,
      },
    };
  }

  /**
   * Calculate aggregated metrics
   */
  private calculateAggregatedMetrics(results: JourneyTestResult[]): AggregatedJourneyMetrics {
    const calcMetrics = (testResults: JourneyTestResult[]) => {
      if (testResults.length === 0) {
        return { avgQuality: 0, likeRate: 0, passRate: 0 };
      }

      const avgQuality =
        testResults.reduce((sum, r) => {
          const avg =
            (r.qualityScores.relevance +
              r.qualityScores.accuracy +
              r.qualityScores.completeness +
              r.qualityScores.clarity) /
            4;
          return sum + avg;
        }, 0) / testResults.length;

      const likeRate =
        testResults.filter((r) => r.satisfactionScore.liked).length / testResults.length;

      const passRate = testResults.filter((r) => r.overallPassed).length / testResults.length;

      return { avgQuality, likeRate, passRate };
    };

    const avgQualityScores = {
      relevance: results.reduce((sum, r) => sum + r.qualityScores.relevance, 0) / results.length,
      accuracy: results.reduce((sum, r) => sum + r.qualityScores.accuracy, 0) / results.length,
      completeness:
        results.reduce((sum, r) => sum + r.qualityScores.completeness, 0) / results.length,
      clarity: results.reduce((sum, r) => sum + r.qualityScores.clarity, 0) / results.length,
    };

    const likeRate =
      results.filter((r) => r.satisfactionScore.liked).length / results.length;

    const avgPerformance = {
      avg_ttft:
        results.reduce((sum, r) => sum + r.totalPerformance.avg_ttft, 0) / results.length,
      avg_ttlt:
        results.reduce((sum, r) => sum + r.totalPerformance.avg_ttlt, 0) / results.length,
      avg_e2e_latency:
        results.reduce((sum, r) => sum + r.totalPerformance.avg_e2e_latency, 0) / results.length,
    };

    const totalTokenUsage = results.reduce(
      (acc, r) => ({
        input_tokens: acc.input_tokens + r.totalTokenUsage.input_tokens,
        output_tokens: acc.output_tokens + r.totalTokenUsage.output_tokens,
        total_tokens: acc.total_tokens + r.totalTokenUsage.total_tokens,
      }),
      { input_tokens: 0, output_tokens: 0, total_tokens: 0 }
    );

    const totalCost = results.reduce(
      (acc, r) => ({
        input_cost: acc.input_cost + r.totalCost.input_cost,
        output_cost: acc.output_cost + r.totalCost.output_cost,
        total_cost: acc.total_cost + r.totalCost.total_cost,
      }),
      { input_cost: 0, output_cost: 0, total_cost: 0 }
    );

    return {
      avgQualityScores,
      likeRate,
      avgPerformance,
      totalTokenUsage,
      totalCost,
      passRate: results.filter((r) => r.overallPassed).length / results.length,
      byDifficulty: {
        easy: calcMetrics(results.filter((r) => r.difficulty === 'easy')),
        medium: calcMetrics(results.filter((r) => r.difficulty === 'medium')),
        hard: calcMetrics(results.filter((r) => r.difficulty === 'hard')),
      },
    };
  }
}
