/**
 * Standalone Debug Script for RAG Evaluator
 * Use this to debug the evaluateDataset function independently
 */

import { RAGEvaluator } from './rag-evaluator';
import { testDataset } from './test-dataset';
import { RAG_EVAL_CONFIG } from './config';

async function debugEvaluateDataset() {
  console.log('Starting RAG Evaluation Debug...');
  console.log('==========================================\n');
  
  // Configuration
  console.log('Configuration:');
  console.log(`   K: ${RAG_EVAL_CONFIG.K}`);
  console.log(`   Rate Limit Delay: ${RAG_EVAL_CONFIG.RATE_LIMIT_DELAY_MS}ms`);
  console.log(`   Similarity Threshold: ${RAG_EVAL_CONFIG.MIN_SIMILARITY_SCORE}`);
  console.log(`   Total Test Cases: ${testDataset.length}\n`);

  // Create evaluator instance
  const evaluator = new RAGEvaluator();
  
  // Use subset for faster debugging (change as needed)
  const DEBUG_TEST_COUNT = 3; // Change this to test more/fewer cases
  const testCases = testDataset.slice(0, DEBUG_TEST_COUNT);
  
  console.log(`Evaluating ${testCases.length} test cases...`);
  console.log('==========================================\n');

  try {
    // Run evaluation with progress callback
    const results = await evaluator.evaluateDataset(
      testCases,
      RAG_EVAL_CONFIG.K,
      (progress, testId) => {
        console.log(`📊 Progress: ${progress.toFixed(1)}% - Testing: ${testId}`);
      }
    );

    // Display results
    console.log('\n==========================================');
    console.log('Evaluation Complete!');
    console.log('==========================================\n');

    console.log('Aggregated Metrics:');
    console.log(`   Avg Precision@${results.config.k}: ${(results.aggregatedMetrics.avgPrecision * 100).toFixed(2)}%`);
    console.log(`   Avg Recall@${results.config.k}: ${(results.aggregatedMetrics.avgRecall * 100).toFixed(2)}%`);
    console.log(`   Avg MRR: ${results.aggregatedMetrics.avgMRR.toFixed(3)}`);
    console.log(`   Avg NDCG@${results.config.k}: ${results.aggregatedMetrics.avgNDCG.toFixed(3)}`);
    console.log(`   Avg F1 Score: ${results.aggregatedMetrics.avgF1.toFixed(3)}`);
    
    console.log('\nIndividual Test Results:');
    results.individualResults.forEach((result, idx) => {
      console.log(`\n   Test ${idx + 1}: ${result.testId}`);
      console.log(`   Query: "${result.query}"`);
      console.log(`   Difficulty: ${result.difficulty}`);
      console.log(`   Hits: ${result.hitsCount}/${result.relevantCount || result.retrievedCount}`);
      console.log(`   Precision: ${(result.metrics.precision * 100).toFixed(2)}%`);
      console.log(`   Recall: ${(result.metrics.recall * 100).toFixed(2)}%`);
      console.log(`   Retrieved IDs: ${result.retrievedIds.join(', ')}`);
    });

    console.log('\n==========================================');
    console.log('Full Results JSON:');
    console.log('==========================================');
    console.log(JSON.stringify(results, null, 2));

  } catch (error) {
    console.error('\nError during evaluation:');
    console.error(error);
    process.exit(1);
  }
}

// Main execution
console.log('\nStarting RAG Evaluator Debug Session...\n');
debugEvaluateDataset()
  .then(() => {
    console.log('\nDebug session completed successfully\n');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\nDebug session failed:');
    console.error(err);
    process.exit(1);
  });
