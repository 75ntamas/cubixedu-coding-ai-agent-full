/**
 * RAG Evaluator
 * Evaluates RAG system performance using standard IR metrics
 */

import OpenAI from 'openai';
import { searchSimilarDocuments } from '@/lib/qdrant';
import { TestCase, RelevantChunk } from './test-dataset';
import { RAG_EVAL_CONFIG } from './config';

export interface EvaluationMetrics {
  precision: number;
  recall: number;
  mrr: number;
  ndcg: number;
  f1Score: number;
}

export interface TestResult {
  testId: string;
  query: string;
  difficulty: string;
  retrievedCount: number;
  relevantCount: number;
  hitsCount: number;
  metrics: EvaluationMetrics;
  retrievedIds: string[];
  expectedIds: string[];
  retrievedPreviews?: string[];
}

export interface AggregatedMetrics {
  avgPrecision: number;
  avgRecall: number;
  avgMRR: number;
  avgNDCG: number;
  avgF1: number;
  byDifficulty: {
    easy: EvaluationMetrics;
    medium: EvaluationMetrics;
    hard: EvaluationMetrics;
  };
}

export interface EvaluationResults {
  individualResults: TestResult[];
  aggregatedMetrics: AggregatedMetrics;
  totalTests: number;
  timestamp: string;
  config: {
    k: number;
    embeddingModel: string;
  };
}

export class RAGEvaluator {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Check if a retrieved chunk matches a relevant chunk based on metadata
   */
  private chunkMatches(retrieved: any, relevant: RelevantChunk): boolean {
    const retrievedFilename = retrieved.payload?.filename || '';
    const retrievedClassName = retrieved.payload?.class_name || '';
    const retrievedMethodName = retrieved.payload?.method_name || '';
    
    return (
      retrievedFilename === relevant.filename &&
      retrievedClassName === relevant.class_name &&
      retrievedMethodName === (relevant.method_name || '')
    );
  }

  /**
   * Create a readable identifier for a chunk based on metadata
   */
  private getChunkIdentifier(chunk: any): string {
    const filename = chunk.payload?.filename || 'unknown';
    const className = chunk.payload?.class_name || 'unknown';
    const methodName = chunk.payload?.method_name || '';
    
    if (methodName) {
      return `${filename}::${className}.${methodName}`;
    }
    return `${filename}::${className}`;
  }

  /**
   * Precision@K: Ratio of relevant documents in top K retrieved
   * Formula: |Relevant ∩ Retrieved| / |Retrieved|
   */
  calculatePrecision(
    retrievedIds: string[],
    relevantIds: string[],
    k?: number
  ): number {
    const topK = k ? retrievedIds.slice(0, k) : retrievedIds;
    if (topK.length === 0) return 0;
    
    const hits = topK.filter(id => relevantIds.includes(id)).length;
    return hits / topK.length;
  }

  /**
   * Recall@K: Ratio of relevant documents found in top K
   * Formula: |Relevant ∩ Retrieved| / |Relevant|
   */
  calculateRecall(
    retrievedIds: string[],
    relevantIds: string[],
    k?: number
  ): number {
    if (relevantIds.length === 0) return 1; // No relevant docs expected = perfect recall
    
    const topK = k ? retrievedIds.slice(0, k) : retrievedIds;
    const hits = topK.filter(id => relevantIds.includes(id)).length;
    return hits / relevantIds.length;
  }

  /**
   * Mean Reciprocal Rank: Reciprocal of position of first relevant document
   * Formula: 1 / (position of first relevant)
   */
  calculateMRR(retrievedIds: string[], relevantIds: string[]): number {
    for (let i = 0; i < retrievedIds.length; i++) {
      if (relevantIds.includes(retrievedIds[i])) {
        return 1.0 / (i + 1);
      }
    }
    return 0.0;
  }

  /**
   * F1 Score: Harmonic mean of Precision and Recall
   * Formula: 2 * (Precision * Recall) / (Precision + Recall)
   */
  calculateF1(precision: number, recall: number): number {
    if (precision + recall === 0) return 0;
    return (2 * precision * recall) / (precision + recall);
  }

  /**
   * NDCG@K: Normalized Discounted Cumulative Gain
   * Takes into account the position of relevant documents
   */
  calculateNDCG(
    retrievedIds: string[],
    relevantIds: string[],
    k: number = RAG_EVAL_CONFIG.K
  ): number {
    const topK = retrievedIds.slice(0, k);
    
    // DCG: Discounted Cumulative Gain
    let dcg = 0;
    topK.forEach((id, idx) => {
      const relevance = relevantIds.includes(id) ? 1 : 0;
      dcg += relevance / Math.log2(idx + 2);
    });
    
    // IDCG: Ideal DCG (if all relevant were at the beginning)
    let idcg = 0;
    const idealRelevance = Array(Math.min(k, relevantIds.length)).fill(1);
    idealRelevance.forEach((rel, idx) => {
      idcg += rel / Math.log2(idx + 2);
    });
    
    return idcg > 0 ? dcg / idcg : 0;
  }

  /**
   * Evaluate a single test case
   */
  async evaluateTestCase(
    testCase: TestCase,
    k: number = RAG_EVAL_CONFIG.K
  ): Promise<TestResult> {
    // If no relevant chunks specified, use lenient evaluation (all results considered correct)
    const isLenient = testCase.relevantChunks.length === 0;

    // 1. Generate embedding
    const embeddingResponse = await this.openai.embeddings.create({
      model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
      input: testCase.query,
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;

    // 2. Retrieval with similarity score filtering
    const retrievalResults = await searchSimilarDocuments(
      queryEmbedding,
      k,
      RAG_EVAL_CONFIG.MIN_SIMILARITY_SCORE
    );

    // 3. Extract identifiers and check matches
    const retrievedIds: string[] = [];
    const retrievedPreviews: string[] = [];
    const matchedRelevantIds: string[] = [];
    
    retrievalResults.forEach(r => {
      // Create readable identifier based on metadata
      const chunkId = this.getChunkIdentifier(r);
      retrievedIds.push(chunkId);
      
      // Check if this retrieved chunk matches any relevant chunk
      for (const relevantChunk of testCase.relevantChunks) {
        if (this.chunkMatches(r, relevantChunk)) {
          matchedRelevantIds.push(chunkId);
          break;
        }
      }
      
      // Get text preview
      const text = r.payload?.text;
      if (typeof text === 'string') {
        retrievedPreviews.push(text.substring(0, 150));
      } else {
        retrievedPreviews.push('');
      }
    });

    // Create expected IDs list from relevantChunks for display
    const expectedIds = testCase.relevantChunks.map(chunk => {
      const methodPart = chunk.method_name ? `.${chunk.method_name}` : '';
      return `${chunk.filename}::${chunk.class_name}${methodPart}`;
    });

    // 4. Calculate metrics using matched IDs
    let precision: number;
    let recall: number;
    let mrr: number;
    
    if (isLenient) {
      // Lenient mode: assume retrieved results are relevant
      precision = 1.0;
      recall = 1.0;
      mrr = 1.0;
    } else {
      precision = this.calculatePrecision(retrievedIds, matchedRelevantIds, k);
      recall = this.calculateRecall(retrievedIds, matchedRelevantIds, k);
      mrr = this.calculateMRR(retrievedIds, matchedRelevantIds);
    }
    
    const ndcg = isLenient ? 1.0 : this.calculateNDCG(retrievedIds, matchedRelevantIds, k);
    const f1Score = this.calculateF1(precision, recall);

    const hits = matchedRelevantIds.length;

    return {
      testId: testCase.id,
      query: testCase.query,
      difficulty: testCase.difficulty,
      retrievedCount: retrievedIds.length,
      relevantCount: testCase.relevantChunks.length,
      hitsCount: hits,
      metrics: { precision, recall, mrr, ndcg, f1Score },
      retrievedIds,
      expectedIds,
      retrievedPreviews,
    };
  }

  /**
   * Evaluate entire dataset
   */
  async evaluateDataset(
    testCases: TestCase[],
    k: number = RAG_EVAL_CONFIG.K,
    progressCallback?: (progress: number, testId: string) => void
  ): Promise<EvaluationResults> {
    const results: TestResult[] = [];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      
      try {
        const result = await this.evaluateTestCase(testCase, k);
        results.push(result);
        
        if (progressCallback) {
          progressCallback(((i + 1) / testCases.length) * 100, testCase.id);
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, RAG_EVAL_CONFIG.RATE_LIMIT_DELAY_MS));
      } catch (error) {
        console.error(`Error evaluating ${testCase.id}:`, error);
        // Add failed result with zeros
        const expectedIds = testCase.relevantChunks.map(chunk => {
          const methodPart = chunk.method_name ? `.${chunk.method_name}` : '';
          return `${chunk.filename}::${chunk.class_name}${methodPart}`;
        });
        
        results.push({
          testId: testCase.id,
          query: testCase.query,
          difficulty: testCase.difficulty,
          retrievedCount: 0,
          relevantCount: testCase.relevantChunks.length,
          hitsCount: 0,
          metrics: { precision: 0, recall: 0, mrr: 0, ndcg: 0, f1Score: 0 },
          retrievedIds: [],
          expectedIds,
        });
      }
    }

    // Calculate aggregated metrics
    const aggregated = this.calculateAggregatedMetrics(results);

    return {
      individualResults: results,
      aggregatedMetrics: aggregated,
      totalTests: results.length,
      timestamp: new Date().toISOString(),
      config: {
        k,
        embeddingModel: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
      },
    };
  }

  /**
   * Calculate aggregated metrics (averages, by difficulty)
   */
  private calculateAggregatedMetrics(results: TestResult[]): AggregatedMetrics {
    const avgMetrics = (testResults: TestResult[]): EvaluationMetrics => {
      if (testResults.length === 0) {
        return { precision: 0, recall: 0, mrr: 0, ndcg: 0, f1Score: 0 };
      }
      
      return {
        precision: testResults.reduce((sum, r) => sum + r.metrics.precision, 0) / testResults.length,
        recall: testResults.reduce((sum, r) => sum + r.metrics.recall, 0) / testResults.length,
        mrr: testResults.reduce((sum, r) => sum + r.metrics.mrr, 0) / testResults.length,
        ndcg: testResults.reduce((sum, r) => sum + r.metrics.ndcg, 0) / testResults.length,
        f1Score: testResults.reduce((sum, r) => sum + r.metrics.f1Score, 0) / testResults.length,
      };
    };

    return {
      avgPrecision: results.reduce((sum, r) => sum + r.metrics.precision, 0) / results.length,
      avgRecall: results.reduce((sum, r) => sum + r.metrics.recall, 0) / results.length,
      avgMRR: results.reduce((sum, r) => sum + r.metrics.mrr, 0) / results.length,
      avgNDCG: results.reduce((sum, r) => sum + r.metrics.ndcg, 0) / results.length,
      avgF1: results.reduce((sum, r) => sum + r.metrics.f1Score, 0) / results.length,
      byDifficulty: {
        easy: avgMetrics(results.filter(r => r.difficulty === 'easy')),
        medium: avgMetrics(results.filter(r => r.difficulty === 'medium')),
        hard: avgMetrics(results.filter(r => r.difficulty === 'hard')),
      },
    };
  }
}
