/**
 * API endpoint for running RAG evaluation
 * POST /api/evaluate/rag - Start evaluation
 * GET /api/evaluate/rag - Get latest results
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { RAGEvaluator } from '@/evaluation/rag/rag-evaluator';
import { testDataset } from '@/evaluation/rag/test-dataset';
import { RAG_EVAL_CONFIG } from '@/evaluation/rag/config';

const RESULTS_DIR = path.join(process.cwd(), 'evaluation', 'rag', 'results');
const LATEST_RESULTS_FILE = path.join(RESULTS_DIR, 'latest-results.json');

// Ensure results directory exists
async function ensureResultsDir() {
  try {
    await fs.mkdir(RESULTS_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

/**
 * POST /api/evaluate/rag
 * Run RAG evaluation
 */
export async function POST(req: NextRequest) {
  try {
    await ensureResultsDir();

    const body = await req.json().catch(() => ({}));
    const k = body.k || RAG_EVAL_CONFIG.K;

    // Create evaluator
    const evaluator = new RAGEvaluator();

    // Set up streaming response
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial message
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'start', 
            message: 'Starting evaluation...', 
            totalTests: testDataset.length 
          })}\n\n`));

          // Run evaluation with progress callback
          const results = await evaluator.evaluateDataset(
            testDataset,
            k,
            (progress, testId) => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                type: 'progress', 
                progress,
                testId,
                message: `Evaluating ${testId}...`
              })}\n\n`));
            }
          );

          // Save results to file
          await fs.writeFile(
            LATEST_RESULTS_FILE,
            JSON.stringify(results, null, 2)
          );

          // Also save with timestamp
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const timestampedFile = path.join(RESULTS_DIR, `evaluation-${timestamp}.json`);
          await fs.writeFile(timestampedFile, JSON.stringify(results, null, 2));

          // Send completion message with results
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'complete', 
            message: 'Evaluation complete!',
            results 
          })}\n\n`));

          controller.close();
        } catch (error: any) {
          console.error('Evaluation error:', error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'error', 
            message: error.message || 'Evaluation failed' 
          })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Error in /api/evaluate/rag POST:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to start evaluation' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/evaluate/rag
 * Get all evaluation results (sorted by timestamp, newest first)
 */
export async function GET(req: NextRequest) {
  try {
    await ensureResultsDir();

    // Check if this is a request for all history
    const url = new URL(req.url);
    const history = url.searchParams.get('history') === 'true';

    if (history) {
      // Get all evaluation files
      const files = await fs.readdir(RESULTS_DIR);
      const evaluationFiles = files.filter(f => f.startsWith('evaluation-') && f.endsWith('.json'));
      
      // Read and parse all files
      const allResults = await Promise.all(
        evaluationFiles.map(async (file) => {
          const filePath = path.join(RESULTS_DIR, file);
          const data = await fs.readFile(filePath, 'utf-8');
          return JSON.parse(data);
        })
      );

      // Sort by timestamp (newest first)
      allResults.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return NextResponse.json(allResults);
    }

    // Default: return latest results
    try {
      const data = await fs.readFile(LATEST_RESULTS_FILE, 'utf-8');
      const results = JSON.parse(data);
      return NextResponse.json(results);
    } catch (error) {
      // No results yet
      return NextResponse.json(
        { error: 'No evaluation results found. Run evaluation first.' },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error('Error in /api/evaluate/rag GET:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch results' },
      { status: 500 }
    );
  }
}
