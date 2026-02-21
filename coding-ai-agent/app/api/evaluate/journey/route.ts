/**
 * API endpoint for Journey Evaluation
 * Handles running and retrieving end-to-end conversation evaluations
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { JourneyEvaluator, JourneyEvaluationResults } from '@/evaluation/journey/journey-evaluator';
import { journeyTestDataset } from '@/evaluation/journey/test-dataset';

const RESULTS_DIR = path.join(process.cwd(), 'evaluation/journey/results');
const LATEST_RESULT_FILE = path.join(RESULTS_DIR, 'latest.json');

/**
 * GET - Retrieve latest or all journey evaluation results
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const history = searchParams.get('history') === 'true';

    // Ensure results directory exists
    await fs.mkdir(RESULTS_DIR, { recursive: true });

    if (history) {
      // Return all historical results
      const files = await fs.readdir(RESULTS_DIR);
      const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'latest.json');
      
      const allResults: JourneyEvaluationResults[] = [];
      for (const file of jsonFiles) {
        try {
          const content = await fs.readFile(path.join(RESULTS_DIR, file), 'utf-8');
          allResults.push(JSON.parse(content));
        } catch (e) {
          console.error(`Error reading ${file}:`, e);
        }
      }

      // Sort by timestamp descending
      allResults.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      return NextResponse.json(allResults);
    }

    // Return latest result
    try {
      const content = await fs.readFile(LATEST_RESULT_FILE, 'utf-8');
      const results = JSON.parse(content);
      return NextResponse.json(results);
    } catch (error) {
      return NextResponse.json(
        { error: 'No evaluation results found. Run an evaluation first.' },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error('Error in GET /api/evaluate/journey:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve results' },
      { status: 500 }
    );
  }
}

/**
 * POST - Run journey evaluation
 * Streams progress updates via Server-Sent Events (SSE)
 */
export async function POST(req: NextRequest) {
  try {
    // Ensure results directory exists
    await fs.mkdir(RESULTS_DIR, { recursive: true });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Initialize evaluator
          const chatApiUrl = process.env.CHAT_API_URL || 'http://localhost:3000/api/chat';
          const evaluator = new JourneyEvaluator(chatApiUrl);

          // Progress callback
          const progressCallback = (progress: number, testId: string) => {
            const message = {
              type: 'progress',
              progress,
              message: `Evaluating ${testId}... (${progress.toFixed(0)}%)`,
            };
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(message)}\n\n`)
            );
          };

          // Run evaluation
          const results = await evaluator.evaluateDataset(
            journeyTestDataset,
            progressCallback
          );

          // Save results
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const timestampedFile = path.join(RESULTS_DIR, `journey-eval-${timestamp}.json`);

          await fs.writeFile(timestampedFile, JSON.stringify(results, null, 2));
          await fs.writeFile(LATEST_RESULT_FILE, JSON.stringify(results, null, 2));

          // Send completion message
          const completeMessage = {
            type: 'complete',
            results,
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(completeMessage)}\n\n`)
          );

          controller.close();
        } catch (error: any) {
          console.error('Journey evaluation error:', error);
          const errorMessage = {
            type: 'error',
            message: error.message || 'Evaluation failed',
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(errorMessage)}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Error in POST /api/evaluate/journey:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to start evaluation' },
      { status: 500 }
    );
  }
}
